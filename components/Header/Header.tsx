import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./Darkmode";
import SignOutLinks from "./SignOutLinks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

// Define types for props
interface ListItemProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}

interface FeatureItem {
  title: string;
  href: string;
  description: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const features: FeatureItem[] = [
    {
      title: "Event Management",
      href: "/features/events",
      description: "Create and manage events with ease",
    },
    {
      title: "Community Building",
      href: "/features/community",
      description: "Build and grow your community",
    },
    {
      title: "Analytics",
      href: "/features/analytics",
      description: "Track engagement and growth",
    },
    {
      title: "Integrations",
      href: "/features/integrations",
      description: "Connect with your favorite tools",
    },
  ];

  const resources: FeatureItem[] = [
    {
      title: "Documentation",
      href: "/resources/docs",
      description: "Learn how to use our platform",
    },
    {
      title: "API Reference",
      href: "/resources/api",
      description: "Integrate with our API",
    },
    {
      title: "Help Center",
      href: "/resources/help",
      description: "Get support and find answers",
    },
    {
      title: "Blog",
      href: "/resources/blog",
      description: "Latest news and updates",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background with animated gradient border */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="bg-background/70 backdrop-blur-xl border-b border-border/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center group">
                <Link href="/" className="flex items-center space-x-3">
                  {/* Animated logo icon */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <div className="w-4 h-4 bg-white rounded-sm transform group-hover:rotate-12 transition-transform duration-300"></div>
                    </div>
                  </div>

                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Gather Beyond
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-300 font-medium bg-transparent hover:bg-accent/50 rounded-lg px-3 py-2 relative group border-none after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                        Features
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg"></div>
                          <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] relative">
                            {features.map((feature, index) => (
                              <ListItem
                                key={feature.title}
                                title={feature.title}
                                href={feature.href}
                                className="animate-fade-up cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                {feature.description}
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-300 font-medium bg-transparent hover:bg-accent/50 rounded-lg px-3 py-2 relative group border-none after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                        Resources
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg"></div>
                          <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] relative">
                            {resources.map((resource, index) => (
                              <ListItem
                                key={resource.title}
                                title={resource.title}
                                href={resource.href}
                                className="animate-fade-up cursor-pointer"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                {resource.description}
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </nav>

              {/* Desktop CTA */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Show when user is NOT signed in */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-accent/50 relative group after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r after:from-purple-600/20 after:to-blue-600/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300">
                      <span className="relative z-10">Sign In</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="cursor-pointer relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300">
                      <span className="relative z-10">Register</span>
                    </button>
                  </SignUpButton>
                </SignedOut>

                {/* Show when user is signed in */}
                <SignedIn>
                  <SignOutLinks />
                  <Link
                    href="/admin/userdashboard"
                    className="cursor-pointer relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300"
                  >
                    <span className="relative z-10">Admin Panel</span>
                  </Link>
                </SignedIn>

                <div className="transform hover:scale-110 transition-transform duration-300">
                  <ModeToggle />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="cursor-pointer md:hidden p-3 rounded-xl hover:bg-accent/50 transition-all duration-300 relative group after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-purple-600/20 after:to-blue-600/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300"
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1.5 relative z-10">
                  <span
                    className={`block w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ${
                      isMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ${
                      isMenuOpen ? "opacity-0 scale-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-full h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ${
                      isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-500 ${
                isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="relative bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl m-4 p-6 shadow-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-purple-50/30 before:to-blue-50/30 dark:before:from-purple-950/30 dark:before:to-blue-950/30 before:rounded-2xl">
                <nav className="relative space-y-6 z-10">
                  {/* Mobile Features */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                      Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {features.map((feature, index) => (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className="cursor-pointer block p-3 text-sm text-muted-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-accent/50 transform hover:scale-105 animate-fade-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="font-medium">{feature.title}</div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Resources */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Resources
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {resources.map((resource, index) => (
                        <Link
                          key={resource.title}
                          href={resource.href}
                          className="cursor-pointer block p-3 text-sm text-muted-foreground hover:text-primary transition-all duration-300 rounded-lg hover:bg-accent/50 transform hover:scale-105 animate-fade-up"
                          style={{ animationDelay: `${index * 100 + 400}ms` }}
                        >
                          <div className="font-medium">{resource.title}</div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50 space-y-4">
                    {/* Mobile Authentication - Show when NOT signed in */}
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="cursor-pointer w-full text-center text-muted-foreground hover:text-primary transition-all duration-300 font-medium py-3 px-4 rounded-xl border border-border/50 hover:bg-accent/50 hover:border-primary/50 transform hover:scale-105">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="cursor-pointer w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg transform hover:scale-105 group after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300">
                          <span className="relative z-10">Register</span>
                        </button>
                      </SignUpButton>
                    </SignedOut>

                    {/* Mobile Authentication - Show when signed in */}
                    <SignedIn>
                      <SignOutLinks />
                      <Link
                        href="/admin/userdashboard"
                        className="cursor-pointer block relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg transform hover:scale-105 group after:absolute after:inset-0 after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-300"
                      >
                        <span className="relative z-10">Admin Panel</span>
                      </Link>
                    </SignedIn>

                    <div className="flex items-center justify-center">
                      <div className="transform hover:scale-110 transition-transform duration-300">
                        <ModeToggle />
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ListItem: React.FC<ListItemProps & { style?: React.CSSProperties }> = ({
  className,
  title,
  children,
  href,
  style,
  ...props
}) => {
  return (
    <li style={style}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/50 hover:shadow-lg transform hover:scale-105 relative after:absolute after:bottom-2 after:left-4 after:w-0 after:h-0.5",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none group-hover:text-primary transition-colors duration-300">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-muted-foreground/80">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default Header;