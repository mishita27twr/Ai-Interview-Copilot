import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Resume } from "@/pages/Resume";
import { InterviewSetup } from "@/pages/InterviewSetup";
import { Interview } from "@/pages/Interview";
import { Feedback } from "@/pages/Feedback";
import { Chat } from "@/pages/Chat";
import { ComingSoon } from "@/pages/ComingSoon";
import { VideoInterview } from "@/pages/VideoInterview";
import { VideoFeedback } from "@/pages/VideoFeedback";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resume" component={Resume} />
        <Route path="/interview-setup" component={InterviewSetup} />
        <Route path="/interview" component={Interview} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/chat" component={Chat} />
        <Route path="/video-interview" component={VideoInterview} />
        <Route path="/video-feedback" component={VideoFeedback} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
