export interface Destination {
  id: string;
  name: string;
  code: string;
  flag: string;
  description: string;
  tagline: string;
  universities: string[];
  intakes: string;
  visaSuccessRate: string;
  glassColor: string;
  refractions: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  course: string;
  university: string;
  destination: string;
  quote: string;
  rating: number;
  bubbleSize: string;
  delay: number;
  initialX: number;
  initialY: number;
}
