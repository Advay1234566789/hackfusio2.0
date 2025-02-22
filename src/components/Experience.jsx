// // import React from "react";
// // import {
// //   VerticalTimeline,
// //   VerticalTimelineElement,
// // } from "react-vertical-timeline-component";
// // import { motion } from "framer-motion";
// // import "react-vertical-timeline-component/style.min.css";
// // import { experiences } from "../constants";
// // import { SectionWrapper } from "../hoc";
// // import { textVariant } from "../utils/motion";

// // const ExperienceCard = ({ experience }) => {
// //   return (
// //     <VerticalTimelineElement
// //       contentStyle={{
// //         background: "#1d1836",
// //         color: "#fff",
// //       }}
// //       contentArrowStyle={{ borderRight: "7px solid  #232631" }}
// //       date={experience.date}
// //       iconStyle={{ background: experience.iconBg }}
// //       icon={
// //         <div className="flex justify-center items-center w-full h-full">
// //           <img
// //             src={experience.icon}
// //             alt={experience.company_name}
// //             className="w-[60%] h-[60%] object-contain"
// //           />
// //         </div>
// //       }
// //     >
// //       <div>
// //         <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
// //         <p
// //           className="text-secondary text-[16px] font-semibold"
// //           style={{ margin: 0 }}
// //         >
// //           {experience.company_name}
// //         </p>
// //       </div>

// //       <ul className="mt-5 list-disc ml-5 space-y-2">
// //         {experience.points.map((point, index) => (
// //           <li
// //             key={`experience-point-${index}`}
// //             className="text-white-100 text-[14px] pl-1 tracking-wider"
// //           >
// //             {point}
// //           </li>
// //         ))}
// //       </ul>
// //     </VerticalTimelineElement>
// //   );
// // };

// // const Experience = () => {
// //   return (
// //     <>
// //       <motion.div
// //         variants={textVariant()}
// //         initial="hidden"
// //         whileInView="visible"
// //         viewport={{ once: true, amount: 0.25 }}
// //       >
// //         <p className="text-[14px] uppercase tracking-wider text-center text-secondary">
// //           Steps
// //         </p>
// //         <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center">
// //           Get here the idea on how to use the web app
// //         </h2>
// //       </motion.div>

// //       <div className="mt-20 flex flex-col">
// //         <VerticalTimeline>
// //           {experiences.map((experience, index) => (
// //             <ExperienceCard
// //               key={`experience-${index}`}
// //               experience={experience}
// //             />
// //           ))}
// //         </VerticalTimeline>
// //       </div>
// //     </>
// //   );
// // };

// // export default SectionWrapper(Experience, "work");


// import React from "react";
// import {
//   VerticalTimeline,
//   VerticalTimelineElement,
// } from "react-vertical-timeline-component";
// import { motion } from "framer-motion";
// import "react-vertical-timeline-component/style.min.css";
// import { experiences } from "../constants";
// import { SectionWrapper } from "../hoc";
// import { textVariant } from "../utils/motion";

// const ExperienceCard = ({ experience }) => {
//   return (
//     <VerticalTimelineElement
//       contentStyle={{
//         background: "#1d1836",
//         color: "#fff",
//       }}
//       contentArrowStyle={{ borderRight: "7px solid  #232631" }}
//       date={experience.date}
//       iconStyle={{ background: experience.iconBg }}
//       icon={
//         <div className="flex justify-center items-center w-full h-full">
//           <img
//             src={experience.icon}
//             alt={experience.company_name}
//             className="w-[60%] h-[60%] object-contain"
//           />
//         </div>
//       }
//     >
//       <div>
//         <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
//         <p
//           className="text-secondary text-[16px] font-semibold"
//           style={{ margin: 0 }}
//         >
//           {experience.company_name}
//         </p>
//       </div>

//       <ul className="mt-5 list-disc ml-5 space-y-2">
//         {experience.points.map((point, index) => (
//           <li
//             key={`experience-point-${index}`}
//             className="text-white-100 text-[14px] pl-1 tracking-wider"
//           >
//             {point}
//           </li>
//         ))}
//       </ul>
//     </VerticalTimelineElement>
//   );
// };

// const Experience = () => {
//   return (
//     <>
//       <motion.div
//         variants={textVariant()}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.25 }}
//       >
//         <p className="text-[14px] uppercase tracking-wider text-center text-secondary">
//           Steps to use EduSphere
//         </p>
//         <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center">
//           Get here the idea on how to use the web app
//         </h2>
//       </motion.div>

//       <div className="mt-20 flex flex-col">
//         <h3 className="text-white text-[24px] font-bold text-center mb-8">Steps to use EduSphere
//         </h3>
//         <VerticalTimeline>
//           {experiences.map((experience, index) => (
//             <ExperienceCard
//               key={`experience-${index}`}
//               experience={experience}
//             />
//           ))}
//         </VerticalTimeline>
//       </div>
//     </>
//   );
// };

// export default SectionWrapper(Experience, "work");


import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className="text-[14px] uppercase tracking-wider text-center text-secondary">
          Steps to use EduSphere
        </p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] text-center">
          Get here the idea on how to use the web app
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <div className="max-w-3xl mx-auto w-full mb-12">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 shadow-2xl">
            <h3 className="text-white text-[28px] font-bold text-center mb-6">
              Steps To Use EduSphere
            </h3>
            <ul className="space-y-3">
              {/* <li className="flex items-start space-x-3 text-white">
                <span className="text-purple-300">•</span>
                <span className="text-[16px]">Login: Use your college email to log in</span>
              </li>
              <li className="flex items-start space-x-3 text-white">
                <span className="text-purple-300">•</span>
                <span className="text-[16px]">View Candidates: Browse candidate profiles with their details.</span>
              </li>
              <li className="flex items-start space-x-3 text-white">
                <span className="text-purple-300">•</span>
                <span className="text-[16px]">Vote: Cast your vote securely.</span>
              </li>
              <li className="flex items-start space-x-3 text-white">
                <span className="text-purple-300">•</span>
                <span className="text-[16px]">Track Results: Monitor live results for transparency</span>
              </li> */}
            </ul>
          </div>
        </div>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");