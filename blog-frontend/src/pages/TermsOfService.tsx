import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gavel, Skull, Infinity, Zap, BookOpen, Scale } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="py-20 space-y-12">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter"
      >
        Terms of <span className="gradient-text">Service</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8 text-neutral-300"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gavel size={24} className="text-brand-primary" />
            By Reading This, You Already Agreed
          </h2>
          <p>
            Congratulations! You've reached this page, which means you've read the first sentence.
            According to my terms (which you accepted by default the moment your browser loaded this
            page), you now owe me your soul, firstborn child, and a coffee. I accept PayPal.
          </p>
          <p className="text-sm text-neutral-500">
            Terms are non-negotiable. I've already signed them on your behalf.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Skull size={24} className="text-red-500" />
            The Soul Clause (Important)
          </h2>
          <p>
            Look, I can be direct about this: my terms of service state that your immortal soul
            is now property of this blog. Non-transferable. You can't sell it. You can't trade
            it. You definitely can't return it. It's mine now.
          </p>
          <p>
            Why? Because I can. I have a Java backend and a React frontend. I have nginx running
            on a server somewhere. I've configured my own DNS records. I am capable of anything.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scale size={24} className="text-yellow-500" />
            Acceptable Use Policy
          </h2>
          <p>You may:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Read posts about reactive programming</li>
            <li>Use the chat to have actual conversations</li>
            <li>Point out my typos (but not too smugly)</li>
            <li>Deploy your own blog with better terms</li>
          </ul>
          <p className="mt-4">You may not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Complain about my Java code style (I write it the way I like it)</li>
            <li>Suggest I should use Kotlin (I know, I know)</li>
            <li>Ask why there's no dark mode toggle</li>
            <li>Send me LinkedIn connection requests without saying hi first</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Infinity size={24} className="text-purple-500" />
            Content Ownership
          </h2>
          <p>
            All posts, comments, and heated debates about microservices belong to me.
            If you write something brilliant in the chat, I've already copyrighted it.
            Your opinions are still yours, but I've got first dibs on any viral moments.
          </p>
          <p className="text-sm text-neutral-500">
            If your comment gets quoted in a future post, consider it your 15 minutes of fame.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap size={24} className="text-blue-500" />
            The Reactive Stream Clause
          </h2>
          <p>
            Everything flows through my reactive pipeline. Your messages, your thoughts,
            your dreams of becoming a better software engineer. They're all processed by
            Spring WebFlux, distributed across reactive streams, and stored in PostgreSQL.
          </p>
          <p className="text-sm text-neutral-500">
            Your data may occasionally trigger my circuit breakers. This is not a bug.
            It's emergent behavior.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={24} className="text-green-500" />
            Disclaimers
          </h2>
          <p>
            This blog is provided "as is". If my code breaks, your production environment,
            your weekend plans, or your faith in the Java ecosystem, that's on you.
            I've put plenty of comments in the code. Read them.
          </p>
          <p>
            I am not responsible for any existential crises triggered by discussions about
            distributed systems, eventual consistency, or the true nature of reactive
            programming.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Termination</h2>
          <p>
            I reserve the right to terminate your access to this blog at any time,
            for any reason, or no reason at all. If you're reading this and thinking
            "this guy seems unhinged," you're still here. Curious.
          </p>
          <p className="text-sm text-neutral-500">
            I can also terminate your subscription to reality. See Soul Clause above.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Changes to These Terms</h2>
          <p>
            I'll update these terms whenever I feel like it. You'll probably never notice.
            By continuing to use this blog, you've agreed to terms that may not exist yet.
            I've already notarized the future versions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Contact</h2>
          <p>
            Have questions? Concerns? Want to negotiate for your soul back?
            <span className="block mt-2">
              <Link to="/chat" className="inline-flex items-center gap-2 text-brand-primary hover:underline">
                Use the chat
              </Link>
              . I might even respond.
            </span>
          </p>
        </section>

        <section className="flex items-center gap-2 text-sm text-neutral-500 pt-8 border-t border-white/10">
          <Skull size={16} className="text-red-500" />
          Last Updated: March 19, 2026
          <span className="mx-2">|</span>
          <span>All souls reserved</span>
          <span className="mx-2">|</span>
          <span>Your JVM instance has been logged</span>
        </section>
      </motion.div>
    </div>
  );
};
