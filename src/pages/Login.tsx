import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import authApi from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/userSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login(values.email, values.password);
      const token = response?.accessToken;
      const user = response?.data;

      if (!token || !user) {
        throw new Error("Invalid response from server.");
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ ...user, token }));

      dispatch(login({ ...user, token }));

      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });

      onLogin?.();
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(message);

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto">
            <Database className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Kipu Import Daemon</h1>
          <p className="text-muted-foreground">Admin Dashboard Access</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Secure Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@example.com"
                      className={
                        errors.email && touched.email
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={
                          errors.password && touched.password
                            ? "border-destructive pr-10"
                            : "pr-10"
                        }
                      />
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="medical"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        {/* Security Notice */}
        {/* <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This dashboard is secured and monitored. All access attempts are
            logged.
          </AlertDescription>
        </Alert> */}
      </div>
    </div>
  );
}
