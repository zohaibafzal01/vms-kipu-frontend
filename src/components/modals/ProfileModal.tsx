import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Lock } from "lucide-react"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const profileSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  currentPassword: Yup.string(),
  newPassword: Yup.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match')
})

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const formik = useFormik({
    initialValues: {
      name: "Admin User",
      email: "admin@kipu.health",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      // Handle profile update
      console.log("Profile update:", values)
      onOpenChange(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Update Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-destructive mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium">Change Password</h4>
              
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...formik.getFieldProps('currentPassword')}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...formik.getFieldProps('newPassword')}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-sm text-destructive mt-1">{formik.errors.newPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...formik.getFieldProps('confirmPassword')}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="medical" className="flex-1">
              Update Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}