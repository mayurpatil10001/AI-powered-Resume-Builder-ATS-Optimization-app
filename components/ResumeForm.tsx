"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resumeDataSchema, type ResumeData, type ResumeDataForm } from "@/lib/types";

export default function ResumeForm(props: {
  targetRole: string;
  setTargetRole: (v: string) => void;
  onSubmit: (data: ResumeData) => void;
}) {
  const form = useForm<ResumeDataForm>({
    resolver: zodResolver(resumeDataSchema),
    defaultValues: {
      personal: { name: "", email: "", phone: "", linkedin: "", github: "", location: "" },
      education: [{ degree: "", institution: "", year: "", gpa: "" }],
      skills: [],
      certifications: [],
      experience: [{ company: "", role: "", dates: "", bullets: [] }],
      projects: [{ name: "", tech: "", bullets: [] }],
      achievements: [],
    },
    mode: "onBlur",
  });

  const edu = useFieldArray({ control: form.control, name: "education" });
  const exp = useFieldArray({ control: form.control, name: "experience" });
  const proj = useFieldArray({ control: form.control, name: "projects" });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => props.onSubmit(resumeDataSchema.parse(values)))}
    >
      <div className="grid gap-2">
        <Label htmlFor="targetRole2">Target role</Label>
        <Input id="targetRole2" value={props.targetRole} onChange={(e) => props.setTargetRole(e.target.value)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input placeholder="Full name" {...form.register("personal.name")} />
          <Input placeholder="Email" {...form.register("personal.email")} />
          <Input placeholder="Phone" {...form.register("personal.phone")} />
          <Input placeholder="Location" {...form.register("personal.location")} />
          <Input placeholder="LinkedIn URL" {...form.register("personal.linkedin")} />
          <Input placeholder="GitHub URL" {...form.register("personal.github")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Education</CardTitle>
          <Button
            type="button"
            variant="secondary"
            onClick={() => edu.append({ degree: "", institution: "", year: "", gpa: "" })}
          >
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {edu.fields.map((f, i) => (
            <div key={f.id} className="grid grid-cols-1 gap-3 rounded-md border p-3 sm:grid-cols-2">
              <Input placeholder="Degree" {...form.register(`education.${i}.degree`)} />
              <Input placeholder="Institution" {...form.register(`education.${i}.institution`)} />
              <Input placeholder="Year" {...form.register(`education.${i}.year`)} />
              <Input placeholder="GPA (optional)" {...form.register(`education.${i}.gpa`)} />
              <div className="sm:col-span-2 flex justify-end">
                <Button type="button" variant="ghost" onClick={() => edu.remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills & Certifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Skills (comma separated)</Label>
            <Textarea
              placeholder="JavaScript, React, SQL..."
              value={(form.watch("skills") ?? []).join(", ")}
              onChange={(e) =>
                form.setValue(
                  "skills",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Certifications (comma separated)</Label>
            <Textarea
              placeholder="AWS CCP, Google Data Analytics..."
              value={(form.watch("certifications") ?? []).join(", ")}
              onChange={(e) =>
                form.setValue(
                  "certifications",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Work Experience</CardTitle>
          <Button
            type="button"
            variant="secondary"
            onClick={() => exp.append({ company: "", role: "", dates: "", bullets: [] })}
          >
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {exp.fields.map((f, i) => (
            <div key={f.id} className="space-y-3 rounded-md border p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input placeholder="Company" {...form.register(`experience.${i}.company`)} />
                <Input placeholder="Role" {...form.register(`experience.${i}.role`)} />
                <Input
                  className="sm:col-span-2"
                  placeholder="Dates (e.g., Jun 2023 - Present)"
                  {...form.register(`experience.${i}.dates`)}
                />
              </div>
              <Textarea
                placeholder="Bullet points (one per line)"
                value={(form.watch(`experience.${i}.bullets`) ?? []).join("\n")}
                onChange={(e) =>
                  form.setValue(
                    `experience.${i}.bullets`,
                    e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={() => exp.remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Projects</CardTitle>
          <Button type="button" variant="secondary" onClick={() => proj.append({ name: "", tech: "", bullets: [] })}>
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {proj.fields.map((f, i) => (
            <div key={f.id} className="space-y-3 rounded-md border p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input placeholder="Project name" {...form.register(`projects.${i}.name`)} />
                <Input placeholder="Tech stack" {...form.register(`projects.${i}.tech`)} />
              </div>
              <Textarea
                placeholder="Bullets (one per line)"
                value={(form.watch(`projects.${i}.bullets`) ?? []).join("\n")}
                onChange={(e) =>
                  form.setValue(
                    `projects.${i}.bullets`,
                    e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                  )
                }
              />
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={() => proj.remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Achievements (one per line)"
            value={(form.watch("achievements") ?? []).join("\n")}
            onChange={(e) =>
              form.setValue(
                "achievements",
                e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
              )
            }
          />
        </CardContent>
      </Card>

      <Button className="w-full" type="submit">
        Save Resume
      </Button>
    </form>
  );
}
