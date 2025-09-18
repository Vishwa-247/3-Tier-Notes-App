import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Brain, FileText, Search, Zap, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Group2-Lovable Smart Notes</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="h-4 w-4 mr-1" />
            AI-Powered Note Taking
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Your thoughts,{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--hero-primary))] to-[hsl(var(--hero-secondary))] bg-clip-text text-transparent">
              organized and enhanced
            </span>{" "}
            by AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your note-taking with intelligent summarization, universal file support, 
            and smart organization. Capture ideas, attach any file, and let AI help you understand it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6">
              Start Taking Smart Notes
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Smart Notes?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Go beyond traditional note-taking with AI-powered features that help you capture, 
              organize, and understand your information better.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Summarization</CardTitle>
                <CardDescription>
                  Automatically generate concise summaries of your long notes and documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Instant note summaries</li>
                  <li>• Key point extraction</li>
                  <li>• Smart insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Universal File Support</CardTitle>
                <CardDescription>
                  Attach any file type with intelligent processing and text extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• PDFs, images, documents</li>
                  <li>• Voice note transcription</li>
                  <li>• OCR text extraction</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Intelligent Search</CardTitle>
                <CardDescription>
                  Find information across notes, files, and attachments with context-aware search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Search inside attachments</li>
                  <li>• Related note suggestions</li>
                  <li>• Smart categorization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perfect for Everyone
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Students", desc: "Research papers, lecture notes, study materials" },
              { title: "Professionals", desc: "Meeting notes, project docs, client files" },
              { title: "Researchers", desc: "Literature reviews, data analysis, citations" },
              { title: "Creatives", desc: "Ideas, inspiration, project assets" }
            ].map((useCase, index) => (
              <Card key={index} className="text-center border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <Shield className="h-16 w-16 text-primary mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Privacy-First AI Processing
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your sensitive data stays secure with client-side AI processing. 
                No need to send your private notes to external servers.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Local AI processing for sensitive content
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  End-to-end encryption for file storage
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  No data tracking or selling
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Secure by Design
                </h3>
                <p className="text-muted-foreground">
                  Built with security and privacy as core principles. Your notes, 
                  your data, your control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to upgrade your note-taking?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with Smart Notes.
          </p>
          <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6">
            Get Started for Free
            <Zap className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Group2-Lovable Smart Notes. Built with ❤️ for better productivity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;