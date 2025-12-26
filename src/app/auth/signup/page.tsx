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
  Anchor 
} from "@mantine/core";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call or call your register action here
    // Example: await registerUser(formData)
    
    setTimeout(() => {
        // Mock success for UI feel
        notifications.show({ title: "Account Created", message: "Redirecting to login...", color: "green" });
        router.push("/auth/login");
        setLoading(false);
    }, 1000);
  };

  return (
    <Container size={420} my={80}>
      <Title ta="center" fw={900}>
        Start tracking today
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} href="/auth/login">
          Login
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
        {/* 👇 FIX: Wrapped in form */}
        <form onSubmit={handleSignup}>
            <TextInput name="name" label="Full Name" placeholder="Ian Macabulos" required />
            <TextInput name="email" label="Email" placeholder="you@subtrack.com" required mt="md" />
            <PasswordInput name="password" label="Password" placeholder="Create a password" required mt="md" />
            
            {/* 👇 FIX: Added type="submit" and loading state */}
            <Button fullWidth mt="xl" color="blue" type="submit" loading={loading}>
            Create Account
            </Button>
        </form>
      </Paper>
    </Container>
  );
}