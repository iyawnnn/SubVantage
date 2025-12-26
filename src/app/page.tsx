import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  SimpleGrid, 
  Card, 
  ThemeIcon, 
  rem, 
  Stack,
  Badge
} from "@mantine/core";
import { 
  IconChartDots, 
  IconCurrencyDollar, 
  IconUsers, 
  IconArrowRight, 
  IconShieldLock 
} from "@tabler/icons-react";
import Link from "next/link";

// --- Feature Data ---
const features = [
  {
    icon: IconChartDots,
    title: "Intelligent Forecasting",
    description: "Our engine analyzes your renewal dates and predicts your monthly burn, so you never get hit with a surprise bill.",
    color: "blue"
  },
  {
    icon: IconCurrencyDollar,
    title: "Multi-Currency Support",
    description: "Paying for tools in USD, EUR, and PHP? We normalize everything to your home currency instantly.",
    color: "green"
  },
  {
    icon: IconUsers,
    title: "Collaborative Billing",
    description: "Track shared subscriptions like Spotify Family. Record the full price, but only count your specific share.",
    color: "violet"
  },
  {
    icon: IconShieldLock,
    title: "Privacy First",
    description: "Your financial data is yours. We use bank-grade encryption and never sell your usage habits.",
    color: "orange"
  }
];

export default function LandingPage() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Background Glow Effect */}
      <div 
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(34,139,230,0.15) 0%, rgba(0,0,0,0) 70%)",
          zIndex: -1,
          pointerEvents: "none",
        }} 
      />

      <Container size="lg" py={120}>
        {/* --- Hero Section --- */}
        <Stack align="center" gap="xl" mb={120} style={{ textAlign: "center" }}>
           <Badge variant="light" color="blue" size="lg" radius="sm">
              v1.0 is Live
           </Badge>
           
           <Title 
             order={1} 
             style={{ 
               fontSize: rem(64), 
               lineHeight: 1.1, 
               fontWeight: 800,
               letterSpacing: "-1px"
             }}
           >
             Master your subscriptions,<br />
             <span style={{ color: "var(--mantine-color-blue-5)" }}>not just track them.</span>
           </Title>

           <Text c="dimmed" size="xl" maw={600}>
             Stop leaking money on forgotten free trials and unused tools. 
             SubTrack gives you a crystal-clear view of your recurring expenses.
           </Text>

           <Group mt="md">
             {/* 👇 FIX: Wrap Button in Link */}
             <Link href="/auth/signup">
               <Button 
                 size="xl" 
                 radius="md" 
                 color="blue"
                 rightSection={<IconArrowRight size={18} />}
                 component="div" // Renders as div to be valid inside <a> tag
               >
                 Get Started Free
               </Button>
             </Link>

             {/* 👇 FIX: Wrap Button in Link */}
             <Link href="/auth/login">
               <Button 
                 size="xl" 
                 radius="md" 
                 variant="default"
                 component="div"
               >
                 Log In
               </Button>
             </Link>
           </Group>
        </Stack>

        {/* --- Bento Grid Features --- */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={30}>
           {features.map((feature) => (
             <Card 
               key={feature.title} 
               padding="xl" 
               radius="lg" 
               className="glass-card" 
               style={{ 
                 background: "rgba(255, 255, 255, 0.03)", 
                 border: "1px solid rgba(255, 255, 255, 0.08)",
                 backdropFilter: "blur(10px)"
               }}
             >
               <ThemeIcon 
                 size={50} 
                 radius="md" 
                 variant="light" 
                 color={feature.color}
                 mb="lg"
               >
                 <feature.icon size={26} stroke={1.5} />
               </ThemeIcon>
               
               <Text fw={700} size="lg" mb="sm">{feature.title}</Text>
               <Text c="dimmed" style={{ lineHeight: 1.6 }}>{feature.description}</Text>
             </Card>
           ))}
        </SimpleGrid>

      </Container>
    </div>
  );
}