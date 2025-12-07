
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categories } from '@/lib/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminNewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState(['']);

  const handleAddGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    const newImages = [...galleryImages];
    newImages[index] = value;
    setGalleryImages(newImages);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would handle form submission to your backend here.
    // For this demo, we'll just show a success message and redirect.
    toast({
      title: 'Product Created',
      description: 'The new product has been successfully added.',
    });
    router.push('/admin/products');
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Add New Product</h1>
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Fill in the information for your new product.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue="New Product Name"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="A great description for a new product."
                        className="min-h-32"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="price">Price (BDT)</Label>
                        <Input
                          id="price"
                          type="number"
                          defaultValue="99.99"
                          step="0.01"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" defaultValue="100" />
                      </div>
                    </div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Product Gallery</CardTitle>
                   <CardDescription>Add additional images for the product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {galleryImages.map((image, index) => (
                     <div key={index} className="flex items-center gap-2">
                        <Input 
                            type="text" 
                            placeholder="https://..."
                            value={image}
                            onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                        />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveGalleryImage(index)}
                            disabled={galleryImages.length === 1}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                  ))}
                   <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryImage}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger
                          id="category"
                          aria-label="Select category"
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>This is the main image for the product.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                     <Label htmlFor="imageUrl">Image URL</Label>
                     <Input id="imageUrl" type="text" placeholder="https://..." defaultValue="https://picsum.photos/seed/new-product/400/600" />
                  </div>
                </CardContent>
              </Card>
               <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/admin/products">Discard</Link>
                  </Button>
                  <Button type="submit">Save Product</Button>
                </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
