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
    title: z.string().min(8, {
        message: "at least 8 characters."
    }).max(60, { message: "at most 60 characters." }),
    owner: z.string().min(20, { message: "at least 20 characters." }).max(150, { message: "at most 150 characters." }),
    address: z.string().min(20, { message: "at least 20 characters." }).max(150, { message: "at most 150 characters." }),
    boughtPrice: z.bigint(),
    collection: z.string().min(3, { message: "at least 3 characters." }).max(44, { message: "at most 44 characters." }),
    standard: z.string().min(5).max(8),
    platform: z.string().min(3).max(26),
    id: z.bigint(),
    url: z.string().min(20, { message: "at least 20 characters." }).max(440, { message: "at most 440 characters." }),
    location: z.string().min(20, { message: "at least 20 characters." }).max(150, { message: "at most 150 characters." }),
})

type AddAssetsFormValues = z.infer<typeof AddFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AddAssetsFormValues> = {
    title: "",
    owner: "",
    address: "",
    boughtPrice: BigInt(0),
    collection: "",
    standard: "",
    platform: "",
    id: BigInt(0),
    url: "",
    location: ""
}
