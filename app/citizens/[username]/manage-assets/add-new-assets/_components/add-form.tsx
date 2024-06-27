"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useState } from "react"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { useRouter } from "next/navigation"

interface AddAssetsFormProps {
    username: string;
}

const AddFormSchema = z.object({
    title: z.string().min(8,{
        message:"at least 8 characters."
    }).max(60,{message:"at most 60 characters."}),
    owner: z.string().min(20,{message:"at least 20 characters."}).max(150,{message:"at most 150 characters."}),
    address: z.string().min(20,{message:"at least 20 characters."}).max(150,{message:"at most 150 characters."}),
    boughtPrice: z.bigint(),
    collection: z.string().min(3,{message:"at least 3 characters."}).max(44,{message:"at most 44 characters."}),
    standard: z.string().min(5).max(8),
    platform: z.string().min(3).max(26),
    id:z.bigint(),
    url:z.string().min(20,{message:"at least 20 characters."}).max(440,{message:"at most 440 characters."}),
    location: z.string().min(20,{message:"at least 20 characters."}).max(150,{message:"at most 150 characters."}),
})

type AddAssetsFormValues = z.infer<typeof AddFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AddAssetsFormValues> = {
    title: "",
    owner:"",
    address:"",
    boughtPrice:BigInt(0),
    collection:"",
    standard:"",
    platform:"",
    id:BigInt(0),
    url:"",
    location:""
}

export const BuyForm = ({
    username
}: AddAssetsFormProps) => {
    const categories = useQuery(api.categories.get);
    const [subcategories, setSubcategories] = useState<Doc<"subcategories">[]>([]);
    const {
        mutate,
        pending
    } = useApiMutation(api.gig.create);
    const router = useRouter();

    const form = useForm<AddAssetsFormValues>({
        resolver: zodResolver(AddFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function handleCategoryChange(categoryName: string) {
        if (categories === undefined) return;
        const selectedCategory = categories.find(category => category.name === categoryName);
        if (selectedCategory) {
            setSubcategories(selectedCategory.subcategories);
        }
    }
    function onSubmit(data: AddAssetsFormValues) {
        mutate({
            title: data.title,
            description: "",
            subcategoryId: data.subcategoryId,
        })
            .then((gigId: Id<"gigs">) => {
                toast.info("Gig created successfully");
                //form.setValue("title", "");
                router.push(`/seller/${username}/manage-gigs/edit/${gigId}`)
            })
            .catch(() => {
                toast.error("Failed to create gig")
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="I will do something amazing" {...field} />
                            </FormControl>
                            <FormDescription>
                                Craft a keyword-rich Gig title to attract potential buyers.
                            </FormDescription>
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
                            <Select
                                onValueChange={(categoryName: string) => {
                                    field.onChange(categoryName);
                                    handleCategoryChange(categoryName);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                {categories && (
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                )}
                            </Select>
                            <FormDescription>
                                Select a category most relevant to your service.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subcategory" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subcategories.map((subcategory, index) => (
                                        <SelectItem key={index} value={subcategory._id}>
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Subcategory will help buyers pinpoint your service more narrowly.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={pending}>Save</Button>
            </form>
        </Form>
    )
}