'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { useRouter, notFound, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiClient } from '@/lib/api-client';
import { IProduct } from '@/lib/models';

const formSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  highlights: z.string().optional(),
  description: z.string().min(1, 'Product description is required.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer.'),
  category: z.string().min(1, 'Please select a category.'),
  productImage: z.any().optional(),
  galleryImages: z.any().optional(),
  size: z.string().optional(),
  sizeGuide: z.string().optional(),
});

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      highlights: '',
      price: 0,
      stock: 0,
      category: '',
      size: '',
      sizeGuide: '',
    },
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await apiClient.get<IProduct>(`/products/${id}`);
        setProduct(data);
        form.reset({
          name: data.name,
          description: data.description,
          highlights: data.highlights || '', // Assuming field exists in interface
          price: data.price,
          stock: data.stock,
          category: data.category,
          size: data.size || '', // Assuming field exists
          sizeGuide: data.sizeGuide || '', // Assuming field exists
        });
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Product not found or failed to load.",
        });
        // router.push('/admin/products'); // Optional: redirect back 
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id, form, toast]);

  async function uploadFile(file: File) {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');
    return result.data.url;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      let mainImageUrl = product?.image;
      if (values.productImage && values.productImage.length > 0) {
        mainImageUrl = await uploadFile(values.productImage[0]);
      }

      let galleryImageUrls = product?.images || [];
      if (values.galleryImages && values.galleryImages.length > 0) {
        // New uploads append to existing? Or replace? 
        // Logic: usually replace or append. Let's just append new ones for now, OR if simpler: 
        // The form control keeps 'files' which are new uploads. 
        // Existing images are in 'product.images'.
        // If we want to remove existing, we need a UI for that. 
        // For this Edit Page MVP, let's just append new uploads to existing list.
        for (const file of Array.from(values.galleryImages)) {
          const url = await uploadFile(file as File);
          if (url) galleryImageUrls.push(url);
        }
      }

      // Construct Payload
      const payload = {
        ...values,
        image: mainImageUrl,
        images: galleryImageUrls,
      };

      await apiClient.put(`/products/${id}`, payload);

      toast({
        title: 'Product Updated',
        description: 'The product has been successfully updated.',
      });
      router.push('/admin/products');
    } catch (error) {
      console.error("Update failed", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
      </div>
      <div className="mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Update the information for your product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Product Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="highlights"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Highlights</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter key features, one per line..."
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="A great description for the product."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sizeGuide"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size Guide (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter size guide details..."
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (BDT)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-6">
                      <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size / Variant</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Free Size, or S, M, L" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Gallery</CardTitle>
                    <CardDescription>
                      Add images for the product. Existing images are preserved unless deleted (TODO: Delete UI).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.images && product.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {product.images.map((img, i) => (
                          <img key={i} src={img} alt={`Gallery ${i}`} className="aspect-square object-cover rounded-md bg-gray-100" />
                        ))}
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="galleryImages"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  onChange(Array.from(e.target.files));
                                }
                              }}
                              {...rest}
                              value={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Product Image</CardTitle>
                    <CardDescription>
                      Update the main image for the product.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.image && !form.watch('productImage')?.[0] && (
                      <div className="relative aspect-square w-full mb-4">
                        <img src={product.image} alt={product.name} className="object-cover rounded-md w-full h-full bg-gray-100" />
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="productImage"
                      render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files) {
                                  onChange(Array.from(e.target.files));
                                }
                              }}
                              {...rest}
                              value={undefined}
                            />
                          </FormControl>
                          <FormMessage />
                          {value && value.length > 0 && (
                            <div className="relative aspect-square w-full mt-4 group">
                              <img
                                src={URL.createObjectURL(value[0])}
                                alt="Main preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-8">
              <Button variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
