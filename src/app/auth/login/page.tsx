"use client";

import { useState } from "react";
import { 
  Paper, 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Container, 
  Group, 
  Divider, 
  Anchor 
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { signIn } from "next-auth/react"; // 👈 Required for buttons to work
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      notifications.show({ title: "Error", message: "Could not connect to Google", color: "red" });
      setGoogleLoading(false);
    }
  };

  // Handle Email/Password Login
  const handleCredentialsLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", { 
      email, 
      password, 
      redirect: false 
    });

    if (result?.error) {
      notifications.show({ title: "Login Failed", message: "Invalid email or password", color: "red" });
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" fw={900}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component={Link} href="/auth/signup">
          Create account
        </Anchor>
      </Text>

      <Paper 
        withBorder 
        shadow="md" 
        p={30} 
        mt={30} 
        radius="md"
        style={{ 
           background: "rgba(255, 255, 255, 0.03)", 
           backdropFilter: "blur(10px)",
           borderColor: "rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* 👇 FIX: Wrapped in <form> so "Enter" key works */}
        <form onSubmit={handleCredentialsLogin}>
          <TextInput 
            name="email"
            label="Email" 
            placeholder="you@mantine.dev" 
            required 
            classNames={{ input: "glass-input" }} 
          />
          <PasswordInput 
            name="password"
            label="Password" 
            placeholder="Your password" 
            required 
            mt="md" 
          />
          
          <Group justify="space-between" mt="lg">
            <Anchor component="button" type="button" size="sm" c="dimmed">
              Forgot password?
            </Anchor>
          </Group>
          
          <Button fullWidth mt="xl" color="blue" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Divider label="Or continue with" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          {/* 👇 FIX: Added onClick handler */}
          <Button 
            onClick={handleGoogleLogin} 
            loading={googleLoading}
            leftSection={<IconBrandGoogle size={16} />} 
            variant="default"
          >
            Google
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}