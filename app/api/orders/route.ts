// app/api/orders/route.ts - Updated to match your schema
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      items,
      shippingAddress,
      phone,
      deliveryInstructions,
      notes,
    } = await req.json();

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Fetch cart to get all items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                farmer: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Group items by farmer
    const itemsByFarmer: Record<string, any[]> = {};
    let totalAmount = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const farmerId = product.farmerId;
      if (!itemsByFarmer[farmerId]) {
        itemsByFarmer[farmerId] = [];
      }

      itemsByFarmer[farmerId].push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price,
        total: product.price * cartItem.quantity,
      });

      totalAmount += product.price * cartItem.quantity;
    }

    // Create orders for each farmer
    const orders = [];

    for (const [farmerId, farmerItems] of Object.entries(itemsByFarmer)) {
      const farmerTotal = farmerItems.reduce((sum, item) => sum + item.total, 0);

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          farmerId,
          totalAmount: farmerTotal,
          status: 'PENDING',
          address: shippingAddress?.address || '',
          city: shippingAddress?.city || '',
          zipCode: shippingAddress?.zipCode || '',
          phone: phone || '',
          notes: deliveryInstructions || notes || '',
          items: {
            create: farmerItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          farmer: {
            select: {
              id: true,
              farmName: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of farmerItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
            totalSales: {
              increment: item.quantity,
            },
          },
        });
      }

      // Update farmer total sales
      await prisma.farmer.update({
        where: { id: farmerId },
        data: {
          totalSales: {
            increment: farmerItems.reduce((sum, item) => sum + item.quantity, 0),
          },
        },
      });

      orders.push(order);
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      orders,
      orderId: orders[0]?.id,
      totalAmount,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}