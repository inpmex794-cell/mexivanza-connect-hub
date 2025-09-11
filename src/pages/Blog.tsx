import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

export const Blog: React.FC = () => {
  const { t } = useLanguage();

  const posts = [
    {
      title: t("blog.post_1_title", "Starting Your Business in Mexico: A Complete Guide"),
      excerpt: t("blog.post_1_excerpt", "Everything you need to know about establishing a business in Mexico, from legal requirements to tax implications."),
      author: "Mexivanza Team",
      date: "2024-01-15",
      category: t("blog.legal", "Legal"),
      featured: true
    },
    {
      title: t("blog.post_2_title", "Digital Marketing Trends in Latin America"),
      excerpt: t("blog.post_2_excerpt", "Explore the latest digital marketing strategies that are driving success in the Latin American market."),
      author: "Ana García",
      date: "2024-01-10",
      category: t("blog.digital", "Digital"),
      featured: false
    },
    {
      title: t("blog.post_3_title", "Top Travel Destinations in Mexico 2024"),
      excerpt: t("blog.post_3_excerpt", "Discover the must-visit destinations in Mexico this year, from hidden gems to popular tourist spots."),
      author: "Carlos Mendoza",
      date: "2024-01-05",
      category: t("blog.travel", "Travel"),
      featured: false
    },
    {
      title: t("blog.post_4_title", "Real Estate Investment Opportunities in Mexican Cities"),
      excerpt: t("blog.post_4_excerpt", "Analyze the best cities for real estate investment in Mexico and what makes them attractive to investors."),
      author: "María Rodríguez",
      date: "2023-12-28",
      category: t("blog.real_estate", "Real Estate"),
      featured: false
    }
  ];

  const categories = [
    { name: t("blog.all", "All"), count: 12 },
    { name: t("blog.legal", "Legal"), count: 4 },
    { name: t("blog.digital", "Digital"), count: 3 },
    { name: t("blog.travel", "Travel"), count: 3 },
    { name: t("blog.real_estate", "Real Estate"), count: 2 }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t("blog.title", "Mexivanza Blog")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {t("blog.subtitle", "Stay updated with the latest insights, trends, and guides about business, travel, and opportunities in Mexico.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              {/* Featured Post */}
              {posts.filter(post => post.featured).map((post, index) => (
                <Card key={index} className="lg:col-span-2 hover:shadow-lg transition-shadow border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        {t("blog.featured", "Featured")}
                      </Badge>
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-2xl leading-tight">{post.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Button className="group">
                      {t("blog.read_more", "Read More")}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Regular Posts */}
              <div className="grid md:grid-cols-2 gap-6">
                {posts.filter(post => !post.featured).map((post, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                      <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <Button variant="outline" size="sm" className="group">
                        {t("blog.read_more", "Read More")}
                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("blog.categories", "Categories")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-sm hover:text-primary cursor-pointer transition-colors">
                          {category.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("blog.newsletter", "Newsletter")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("blog.newsletter_desc", "Subscribe to get the latest updates and insights directly to your inbox.")}
                  </p>
                  <Button className="w-full">
                    {t("blog.subscribe", "Subscribe")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};