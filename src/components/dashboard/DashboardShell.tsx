"use client";

import { AppShell, AppShellHeader, AppShellNavbar, AppShellMain, Group, Title, NavLink, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDashboard, IconSettings } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./UserMenu";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShellHeader p="md">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} c="blue">SubTrack</Title>
          </Group>
          
          <UserMenu image={user?.image} name={user?.name} email={user?.email} />
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="md">
        <NavLink
          label="Dashboard"
          leftSection={<IconDashboard size="1rem" stroke={1.5} />}
          component={Link}
          href="/dashboard"
          active={pathname === "/dashboard"}
          onClick={() => { if (opened) toggle(); }} // Close menu on click (mobile)
        />
        <NavLink
          label="Settings"
          leftSection={<IconSettings size="1rem" stroke={1.5} />}
          component={Link}
          href="/settings"
          active={pathname === "/settings"}
          onClick={() => { if (opened) toggle(); }}
        />
      </AppShellNavbar>

      <AppShellMain bg="gray.0">
        {children}
      </AppShellMain>
    </AppShell>
  );
}