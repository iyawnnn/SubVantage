"use client";

import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Title,
  NavLink,
  Burger,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconSettings,
  IconSun,
  IconMoon,
  IconArchive, // 👈 Added Icon
} from "@tabler/icons-react";
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
  const { toggleColorScheme } = useMantineColorScheme();

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
      <AppShellHeader p="md" className="glass-header">
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3} c="azure">
              SubTrack
            </Title>
          </Group>

          <Group>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="default"
              size="lg"
              radius="md"
              aria-label="Toggle color scheme"
            >
              <IconSun className="hide-in-light" size={18} stroke={1.5} />
              <IconMoon className="hide-in-dark" size={18} stroke={1.5} />
            </ActionIcon>
            <UserMenu
              image={user?.image}
              name={user?.name}
              email={user?.email}
            />
          </Group>
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="md" className="glass-navbar">
        <NavLink
          label="Dashboard"
          leftSection={<IconDashboard size="1rem" stroke={1.5} />}
          component={Link}
          href="/dashboard"
          active={pathname === "/dashboard"}
          onClick={() => {
            if (opened) toggle();
          }}
          variant="light"
          color="azure"
          style={{ borderRadius: "8px", marginBottom: "4px" }}
        />

        {/* 👇 ADDED ARCHIVE LINK */}
        <NavLink
          label="Archive"
          leftSection={<IconArchive size="1rem" stroke={1.5} />}
          component={Link}
          href="/archive"
          active={pathname === "/archive"}
          onClick={() => {
            if (opened) toggle();
          }}
          variant="light"
          color="azure"
          style={{ borderRadius: "8px", marginBottom: "4px" }}
        />

        <NavLink
          label="Settings"
          leftSection={<IconSettings size="1rem" stroke={1.5} />}
          component={Link}
          href="/settings"
          active={pathname === "/settings"}
          onClick={() => {
            if (opened) toggle();
          }}
          variant="light"
          color="azure"
          style={{ borderRadius: "8px" }}
        />
      </AppShellNavbar>

      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}