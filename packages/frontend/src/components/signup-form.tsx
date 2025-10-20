import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RegisterFormFields } from "@/store/types/auth";
import Joi from "joi";
import Link from "next/link";
import FormControl from "./Common/FormControl";
import { SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useAuthRegister } from "@/services/auth";

const RegisterSchema = Joi.object<RegisterFormFields>({
  firstName: Joi.string().required().label("First name"),
  lastName: Joi.string().required().label("Last name"),
  email: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .label("Email")
    .messages({
      "string.pattern.base": "Only Gmail addresses are allowed",
    }),
  password: Joi.string().min(8).required().label("Password"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirm Password")
    .messages({
      "any.only": "Confirm Password does not match Password",
    }),
});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    resolver: joiResolver(RegisterSchema),
    mode: "onBlur",
  });

  const { mutateAsync: signup, isPending } = useAuthRegister();

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3002/api/auth/google";
  };

  const onSubmit: SubmitHandler<RegisterFormFields> = async (formdata) => {
    const { confirmPassword, firstName, lastName, ...rest } = formdata;
    const name = `${firstName} ${lastName}`;
    const payload = {
      ...rest,
      name,
    };
    await signup(payload);
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-2">
              <FormControl error={errors.firstName?.message}>
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...register("firstName")}
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                  />
                </Field>
              </FormControl>
              <FormControl error={errors.lastName?.message}>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...register("lastName")}
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                </Field>
              </FormControl>
            </div>
            <FormControl error={errors.email?.message}>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <FieldDescription>
                  We&apos;ll use this to fetch the emails from your gmail
                  account. Please make sure to enter a valid gmail address.
                </FieldDescription>
              </Field>
            </FormControl>
            <FormControl error={errors.password?.message}>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                />
                {!errors.password?.message && (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>
            </FormControl>
            <FormControl error={errors.confirmPassword?.message}>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  {...register("confirmPassword")}
                  id="confirm-password"
                  type="password"
                  required
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>
            </FormControl>
            <FieldGroup>
              <Field>
                <Button type="submit" loading={isPending} disabled={isPending}>
                  Create Account
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link href="/auth/login">Sign In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
