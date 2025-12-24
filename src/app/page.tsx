import { SignInButton } from "@/components/auth/SignInButton";
import { Container, Title, Text, Group } from "@mantine/core";

export default function Home() {
  return (
    <Container size="sm" mt="xl" style={{ textAlign: "center" }}>
      <Title order={1} mb="md">Welcome to SubTrack</Title>
      <Text c="dimmed" mb="xl">
        The B2B Subscription Management Platform.
      </Text>
      
      <Group justify="center">
        <SignInButton />
      </Group>
    </Container>
  );
}