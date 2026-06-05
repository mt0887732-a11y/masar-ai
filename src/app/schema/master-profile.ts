import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  linkedin: z.string().optional(),
  location: z.string().optional(),
});

export const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  major: z.string(),
  graduationYear: z.string(),
});

export const ProjectSchema = z.object({
  title: z.string(),
  technologies: z.array(z.string()),
  actionBullets: z.array(z.string()),
});

export const ExperienceSchema = z.object({
  role: z.string(),
  organization: z.string(),
  period: z.string(),
  actionBullets: z.array(z.string()),
});

export const MasterProfileSchema = z.object({
  contact: ContactSchema,
  summary: z.string(),
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(z.string()),
});