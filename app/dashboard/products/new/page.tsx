// app/dashboard/products/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { 
  Package, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Save,
  Eye,
  DollarSign,
  Tag,
  List,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    subcategory: '',
    sku: '',
    stock: '',
    weight: '',
    dimensions: '',
    tags: [] as string[],
    currentTag: ''
  })

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy & Eggs',
    'Meat & Poultry',
    'Grains & Pulses',
    'Herbs & Spices',
    'Honey & Spreads',
    'Baked Goods',
    'Beverages',
    'Other'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newImages])
  }

  const removeImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: ''
      })
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = 'Product name is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.stock) newErrors.stock = 'Stock quantity is required'
    if (previewImages.length === 0) newErrors.images = 'At least one product image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    router.push('/dashboard/products')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span>New Product</span>
          </div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            List your farm-fresh product for customers to discover
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/products">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button 
            onClick={handleSubmit}
            disabled={saving}
            className="gap-2 bg-linear-to-r from-primary to-emerald-600"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Organic Heirloom Tomatoes"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20 resize-none ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe your product in detail..."
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`pl-7 ${errors.price ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compare at Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Original price to show discount
                  </p>
                </div>
              </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Product Images <span className="text-red-500">*</span>
              </h2>
              
              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  errors.images ? 'border-red-500' : 'border-muted-foreground/20'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </label>
                </div>
                {errors.images && (
                  <p className="text-xs text-red-500">{errors.images}</p>
                )}
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={image}
                          alt={`Preview ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Tags
              </h2>
              
              <div className="flex gap-2 mb-3">
                <Input
                  value={formData.currentTag}
                  onChange={(e) => setFormData({ ...formData, currentTag: e.target.value })}
                  placeholder="Add tags (e.g., organic, fresh, local)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                Category
              </h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-background focus:outline-2 focus:outline-primary/20 ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g., Cherry Tomatoes"
                />
              </div>
            </Card>

            {/* Inventory */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Inventory</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    SKU (Stock Keeping Unit)
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Unique identifier"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={errors.stock ? 'border-red-500' : ''}
                    placeholder="Number of units available"
                  />
                  {errors.stock && (
                    <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Shipping */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (lbs)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dimensions (in)
                  </label>
                  <Input
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="L x W x H"
                  />
                </div>
              </div>
            </Card>

            {/* Preview Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => router.push('/products/preview')}
            >
              <Eye className="w-4 h-4" />
              Preview Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}