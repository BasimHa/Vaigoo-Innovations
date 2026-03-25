"use client";

import { motion } from 'framer-motion';
import { ProjectCard } from '../ui/ProjectCard';
import { fadeUp, staggerContainer } from '../animations/variants';

const projects = [
  {
    title: "Seeheim Resorts",
    category: "Hospitality Web Platform",
    description: "Premium online booking and presentation platform.",
    href: "https://seeheimresorts.com/",
    imageSrc: "https://s0.wp.com/mshots/v1/https://seeheimresorts.com?w=1200&h=1800"
  },
  {
    title: "DOC Interiors",
    category: "Corporate Portfolio",
    description: "Elegant digital showcase for high-end interior design.",
    href: "https://docinteriors.com/",
    imageSrc: "https://s0.wp.com/mshots/v1/https://docinteriors.com?w=1200&h=1800"
  },
  {
    title: "South Indian Cabs",
    category: "Travel & Transport",
    description: "Scalable booking system for regional travels.",
    href: "https://southindiancabs.com/",
    imageSrc: "https://s0.wp.com/mshots/v1/https://southindiancabs.com?w=1200&h=1800"
  },
  {
    title: "Aiswaria OOH",
    category: "Advertising",
    description: "Dynamic outdoor advertising network portal and business site.",
    href: "https://aiswariaooh.com/",
    imageSrc: "https://s0.wp.com/mshots/v1/https://aiswariaooh.com?w=1200&h=1800"
  }
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 relative flex justify-center w-full">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 md:text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-sm font-bold tracking-widest text-primary-blue uppercase mb-3">
            Case Studies
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900">
            Featured Work
          </motion.h3>
          <motion.p variants={fadeUp} className="text-lg text-slate-600">
            A selection of complex problems we've solved through elegant engineering and strategic design.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
        >
          {projects.map((project, idx) => (
            <ProjectCard 
              key={idx}
              title={project.title}
              category={project.category}
              description={project.description}
              href={project.href}
              imageSrc={project.imageSrc}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
