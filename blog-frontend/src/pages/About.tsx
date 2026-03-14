import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Github, Linkedin, Mail, Server, Cpu, Globe, Activity } from 'lucide-react';

export const About: React.FC = () => {
  const techStack = [
    { name: 'Java', icon: <Cpu size={18} /> },
    { name: 'Spring Boot', icon: <Server size={18} /> },
    { name: 'WebFlux', icon: <Activity size={18} /> }, // Need to import Activity
    { name: 'React', icon: <Globe size={18} /> },
    { name: 'TypeScript', icon: <div className="font-bold text-[10px]">TS</div> },
    { name: 'PostgreSQL', icon: <Server size={18} /> },
  ];

  return (
    <div className="py-20 space-y-20">
      <section className="space-y-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tighter"
        >
          About <span className="gradient-text">Me</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-lg"
        >
          <p>
            I'm a backend-leaning full-stack engineer passionate about building scalable, 
            reactive systems and high-performance distributed architectures.
          </p>
          <p>
            This blog is where I share my findings, experiments, and deep dives into 
            modern technology stacks, with a particular focus on the Java ecosystem and 
            reactive programming.
          </p>
        </motion.div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="flex items-center gap-3 py-4" hover={true}>
                <div className="text-brand-primary">{tech.icon}</div>
                <span className="font-medium">{tech.name}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Connect</h2>
        <div className="flex flex-wrap gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="glass-button gap-2 group">
            <Github size={18} className="group-hover:text-white transition-colors" />
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="glass-button gap-2 group">
            <Linkedin size={18} className="group-hover:text-white transition-colors text-blue-400" />
            LinkedIn
          </a>
          <a href="mailto:hello@example.com" className="glass-button gap-2 group">
            <Mail size={18} className="group-hover:text-white transition-colors text-red-400" />
            Email
          </a>
        </div>
      </section>
    </div>
  );
};
