// import React from "react";
// import { motion } from "framer-motion";
// import {
//   Mail,
//   Users,
//   ChevronRight,
//   Settings,
//   Bell,
//   Shield,
//   Headphones,
//   Building,
//   Code,
//   Briefcase,
// } from "lucide-react";

// interface TeamEmail {
//   id: string;
//   team: string;
//   email: string;
//   description: string;
//   icon: React.ElementType;
//   members: number;
// }

// const teamEmails: TeamEmail[] = [
//   {
//     id: "1",
//     team: "Customer Support",
//     email: "questions@auditlyai.com",
//     description: "Handle customer inquiries and technical support requests",
//     icon: Headphones,
//     members: 12,
//   },
//   {
//     id: "2",
//     team: "Development Team",
//     email: "info@auditlyai.com",
//     description: "Technical development and system maintenance",
//     icon: Code,
//     members: 8,
//   },
//   {
//     id: "3",
//     team: "Sales Department",
//     email: "info@auditlyai.com",
//     description: "Sales inquiries and business development",
//     icon: Briefcase,
//     members: 15,
//   },
//   {
//     id: "4",
//     team: "Security Team",
//     email: "security@auditlyai.com",
//     description: "Security incidents and compliance matters",
//     icon: Shield,
//     members: 6,
//   },
//   {
//     id: "5",
//     team: "Operations",
//     email: "questions@auditlyai.com",
//     description: "Day-to-day operations and logistics",
//     icon: Building,
//     members: 10,
//   },
// ];

// function EmailConfigurations() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16"
//         >
//           <motion.div
//             initial={{ scale: 0.8, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 200,
//               damping: 20,
//             }}
//             className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
//           >
//             <Mail className="w-10 h-10 text-blue-600" />
//           </motion.div>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             //    className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//             className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
//           >
//             Team Email Configuration
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-xl text-gray-600 max-w-2xl mx-auto"
//           >
//             Manage and configure email addresses for different teams and
//             departments
//           </motion.p>
//         </motion.div>

//         {/* Email Configuration Cards */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           {teamEmails.map((team) => (
//             <motion.div
//               key={team.id}
//               variants={itemVariants}
//               whileHover={{ scale: 1.02 }}
//               className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
//             >
//               <div className="p-6">
//                 <div className="flex items-start gap-4">
//                   <motion.div
//                     whileHover={{ scale: 1.1, rotate: 10 }}
//                     className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
//                   >
//                     <team.icon className="w-6 h-6 text-blue-600" />
//                   </motion.div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {team.team}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {team.description}
//                         </p>
//                       </div>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {team.members} members
//                       </span>
//                     </div>
//                     <div className="mt-4 flex items-center gap-2 text-gray-900">
//                       <Mail className="w-4 h-4 text-blue-500" />
//                       <span className="text-sm font-medium">{team.email}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
//                   >
//                     Configure
//                     <ChevronRight className="w-4 h-4" />
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="mt-12 flex justify-center gap-4"
//         >
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//           >
//             <Settings className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">Global Settings</span>
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
//           >
//             <Bell className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">Notifications</span>
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// export default EmailConfigurations;


import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Users,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  Headphones,
  Building,
  Code,
  Briefcase,
} from "lucide-react";

interface TeamEmail {
  id: string;
  team: string;
  email: string;
  description: string;
  icon: React.ElementType;
  members: number;
}

const teamEmails: TeamEmail[] = [
  {
    id: "1",
    team: "Customer Support",
    email: "questions@auditlyai.com",
    description: "Handle customer inquiries and technical support requests",
    icon: Headphones,
    members: 12,
  },
  {
    id: "2",
    team: "Development Team",
    email: "info@auditlyai.com",
    description: "Technical development and system maintenance",
    icon: Code,
    members: 8,
  },
  {
    id: "3",
    team: "Sales Department",
    email: "info@auditlyai.com",
    description: "Sales inquiries and business development",
    icon: Briefcase,
    members: 15,
  },
  {
    id: "4",
    team: "Security Team",
    email: "security@auditlyai.com",
    description: "Security incidents and compliance matters",
    icon: Shield,
    members: 6,
  },
  {
    id: "5",
    team: "Operations",
    email: "questions@auditlyai.com",
    description: "Day-to-day operations and logistics",
    icon: Building,
    members: 10,
  },
];

function EmailConfigurations() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <Mail className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[2.5rem] font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Team Email Configuration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Manage and configure email addresses for different teams and
            departments
          </motion.p>
        </motion.div>

        {/* Email Configuration Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {teamEmails.map((team) => (
            <motion.div
              key={team.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <team.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {team.team}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {team.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {team.members} members
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{team.email}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendEmail(team.email)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Send Email
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Global Settings</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700">Notifications</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default EmailConfigurations;
