import {
  mobile,
   backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  tcs,
  intelligence,
  sun,
  payment,
  intelligence2,
  rental,
} from "../assets";


export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Student Election",
    icon: web,
  },
  {
    title: "Expense Tracker",
    icon: mobile,
  },
  {
    title: "Anonymous Complaint System",
    icon: web,
  },
  {
    title: "Club Management",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Student Election System",
    company_name: "",
    icon: intelligence ,
    iconBg: "white",
    date: "",
    points: [
      // "Developing and maintaining web applications using React.js, Next.js, Express.js and other related technologies.",
      "Login: Use your college email to log in",
      "View Candidates: Browse candidate profiles with their details.",
      "Vote: Cast your vote securely.",
      // "Implementing responsive design and ensuring cross-browser compatibility.",
      "Track Results: Monitor live results for transparency",
    ],
},
  {
    title: "Automated Health & Leave Notifications",
    company_name: "",
    icon: meta,
    iconBg: "white",
    date: "",
    points: [
      "Doctor Reports Sickness: The system automatically notifies the class coordinator.",
      "Student Leaves Campus: An automated email is sent to parents.",
     
    ],
  },
  {
    title: " Campus Facility Booking System",
    company_name: "",
    icon: shopify,
    iconBg: "white",
    date: "",
    points: [
      "Check Availability: View available slots for campus facilities.",
      "Request Booking: Submit a request for approval.",
      "Contributed to web application development and maintenance, improving performance through active participation in codebase enhancements and troubleshooting.",
      "Gained exposure to frameworks like Bootstrap by helping create visually appealing and user-friendly web interfaces.",
    ],
  },
  {
    title: "Transparent Application & Approval System"
,
    company_name: "",
    icon: starbucks,
    iconBg: "white",
    date: "",
    points: [
      "Submit Applications: Request for event organization, budget approval, or sponsorships.",

      "View Applications: All students and faculty can see submitted applications",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Academic Integrity & Cheating Record System",
    company_name: "",
    icon:sun,
    iconBg: "white",
    date: "",
    points: [
      "Record of Cheating Cases: If caught cheating, your name, reason, and proof are visible to everyone.",
      
    ],
  },
  {
    title: "Anonymous Complaint System",
    company_name: "",
    icon: tcs,
    iconBg: "white",
    date: "",
    points: [
      "Submit Complaints: File a complaint anonymously",
      "Moderation: The system filters inappropriate content.",
      "Approval Mechanism: Board members must approve revealing an identity.",
      
    ],
  },
  {
    title: "Transparent College Budget & Sponsorship Tracking",
    company_name: "",
    icon: tesla,
    iconBg: "white",
    date: "",
    points: [
      "View Budget Details: Check the public record of college funds, sponsorships, and expenses.",
      "Upload Proof: Bills, receipts, and images must be uploaded for verification.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
  {
    title: "Restricted Access for College Members Only",
    company_name: "",
    icon: backend,
    iconBg: "white",
    date: "",
    points: [
      "Authentication: Only users with college email IDs can access the system.",
      
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Jaser proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Jaser does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Jaser optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Alumini meet",
    description:
      // "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
      "A full-featured web application developed using the MERN stack, designed to simulate the functionality of PayTM. This app supports user registration, authentication, and secure banking transactions. Built with modern tools and technologies such as React with Vite, Tailwind CSS for styling.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "express.js",
        color: "pink-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: payment,
    source_code_link: "https://github.com/syedahmedullah14/PayTM-Project",
  },
  {
    name: "Company Portfolio",
    description:
      "Built a responsive portfolio using ReactJS, leveraging components and state management for a seamless user experience across devices. Developed a feature for dynamic theme changes, enhancing user engagement by allowing personalization of background and foreground colors through efficient state management.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "bootsrap5",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: intelligence2,
    source_code_link: "https://int-elligence.co.uk/",
  },
  {
    name: "Rental Management System",
    description:
      "Developed a robust system for a construction equipment company to manage customer records, including transaction history, products, suppliers, and rental records, ensuring secure and efficient data storage and retrieval. Integrated a billing and invoicing system, allowing for accurate and streamlined financial transactions.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "express.js",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "aws",
        color: "green-text-gradient",
      },
    ],
    image: rental,
    source_code_link: "https://github.com/syedahmedullah14",
  },
];

export { services, technologies, experiences, testimonials, projects };
