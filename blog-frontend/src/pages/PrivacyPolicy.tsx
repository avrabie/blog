import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, AlertTriangle, Shield, Coffee, Heart } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-20 space-y-12">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tighter"
      >
        Privacy <span className="gradient-text">Policy</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8 text-neutral-300"
      >
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle size={24} className="text-yellow-500" />
            Look, I Have to Say This
          </h2>
          <p>
            Google made me put this page here. I don't read emails. I have a Java backend
            to maintain, a PostgreSQL database that definitely needs optimization, and a
            React frontend that keeps growing. I do not have time to read your privacy-related
            complaints.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield size={24} className="text-brand-primary" />
            What We Actually Collect
          </h2>
          <p>
            Your IP address gets logged by nginx. Your messages go through my Spring WebFlux
            reactive pipeline. Your profile picture is stored in PostgreSQL because I haven't
            migrated to S3 yet. The Java garbage collector judges your browsing habits.
          </p>
          <p className="text-sm text-neutral-500">
            Also, the react-query devtools know everything.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Coffee size={24} className="text-amber-500" />
            Cookies
          </h2>
          <p>
            Yes, there are cookies. I use them to remember that you're logged in so I don't
            have to ask you for your password every time. The cookies are not edible.
            Please do not eat them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageCircle size={24} className="text-green-500" />
            How to Actually Reach Me
          </h2>
          <p>
            There's a streaming chat channel on this site. That's where conversations happen.
            If you email me, I will see it. I will not respond to it. It will sit there,
            gathering digital dust, alongside all the other unread emails in my inbox.
          </p>
          <p className="text-sm text-neutral-500">
            Seriously, just use the chat. It's real-time. I might even respond.
          </p>
          <Link to="/chat" className="inline-flex items-center gap-2 text-brand-primary hover:underline">
            <MessageCircle size={16} />
            Go to Chat
          </Link>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Third-Party Services</h2>
          <p>
            I use third-party services. Some of them probably track you. I use Google Analytics
            because I want to see how many people actually read my posts (the answer is: not many,
            but the few who do seem cool). There's probably a CDN somewhere that has your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Data Security</h2>
          <p>
            I try my best. My passwords are in a password manager. The database credentials
            are in environment variables. The reactive streams are... mostly thread-safe.
            I've had two panic attacks about security and fixed the issues both times.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Final Thoughts</h2>
          <p>
            This is my personal blog. I'm a software engineer who likes writing about reactive
            programming, Java, and occasionally other things that catch my attention. If
            you're still reading this, you probably have too much time on your hands.
            <span className="text-sm text-neutral-500 block mt-2">
              Welcome to my corner of the internet. Be excellent to each other.
            </span>
          </p>
        </section>

        <section className="flex items-center gap-2 text-sm text-neutral-500 pt-8 border-t border-white/10">
          <Heart size={16} className="text-red-500" />
          Last Updated: March 19, 2026
          <span className="mx-2">|</span>
          <span>Built with Java + WebFlux + React</span>
          <span className="mx-2">|</span>
          <span>Deployed with love and mild anxiety</span>
        </section>
      </motion.div>
    </div>
  );
};
