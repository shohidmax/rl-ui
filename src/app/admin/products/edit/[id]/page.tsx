
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, products, type Product } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams, notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";


const formSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  description: z.string().min(1, "Description is required."),
  highlights: z.string().min(1, "Product highlights are required."),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  category: z.string().min(1, "Please select a category."),
  stock: z.coerce.number().min(0, "Stock can't be negative."),
  picture: z.any().optional(),
  gallery: z.any().optional(),
});


export default function EditProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      highlights: "",
      price: 0,
      category: "",
      stock: 0,
      gallery: undefined,
      picture: undefined,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        highlights: product.description, // Assuming highlights are same as description for now
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    }
  }, [product, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Updated Product Data:", values);

    toast({
      title: "Product Saved!",
      description: `${values.name} has been updated.`,
    });
    
    // In a real app, you'd save this to a database.
    // For now, we'll just redirect back to the products list.
    router.push("/admin/products");
  };

  if (!product) {
    return (
        <div className="flex flex-col">
            <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
                <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/products">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Products</span>
                    </Link>
                </Button>
                <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
                </div>
            </header>
            <main className="flex-1 p-6">
                <div>Loading product...</div>
            </main>
        </div>
    );
  }


  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Products</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Edit Product: {product.name}</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Update the details for this product.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Elegant Floral Three-Piece" {...field} />
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
                            placeholder="A beautifully crafted three-piece suit..."
                            {...field}
                          />
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
                            placeholder="e.g.&#10;- Made from 100% premium cotton&#10;- Features intricate embroidery"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (BDT)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 3200" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                             <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                             </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                     <FormField
                      control={form.control}
                      name="picture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image (leave blank to keep current)</FormLabel>
                           <FormControl>
                            <Input type="file" accept="image/*" {...form.register('picture')} />
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gallery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Gallery (Optional)</FormLabel>
                          <FormControl>
                            <Input type="file" multiple {...form.register('gallery')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 25" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
