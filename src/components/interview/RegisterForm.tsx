import { useState } from "react";
import { useInterview } from "@/context/InterviewContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, GraduationCap, BookOpen, Calendar } from "lucide-react";

export default function RegisterForm() {
  const { setProfile, setStage } = useInterview();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", college: "", branch: "", graduationYear: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "10-digit phone required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (!form.college.trim()) e.college = "College is required";
    if (!form.branch.trim()) e.branch = "Branch is required";
    if (!form.graduationYear) e.graduationYear = "Year required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setProfile(form);
      setStage("upload");
    }
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
    { key: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "john@example.com" },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "9876543210" },
    { key: "password", label: "Password", icon: Lock, type: "password", placeholder: "••••••••" },
    { key: "college", label: "College Name", icon: GraduationCap, type: "text", placeholder: "IIT Mumbai" },
    { key: "branch", label: "Branch", icon: BookOpen, type: "text", placeholder: "Computer Science" },
    { key: "graduationYear", label: "Graduation Year", icon: Calendar, type: "number", placeholder: "2025" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient-primary mb-2">Student Registration</h1>
        <p className="text-muted-foreground">Create your account to start mock interviews</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-card glow-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, i) => (
            <motion.div key={field.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Label className="text-sm text-secondary-foreground flex items-center gap-2 mb-1.5">
                <field.icon className="w-3.5 h-3.5 text-primary" />
                {field.label}
              </Label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              className="bg-secondary border-border focus:border-primary"
            />
            {errors[field.key] && <p className="text-destructive text-xs mt-1">{errors[field.key]}</p>}
          </motion.div>
          ))}
        </div>
        <Button type="submit" className="w-full mt-6 bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          Continue →
        </Button>
      </form>
    </motion.div>
  );
}
