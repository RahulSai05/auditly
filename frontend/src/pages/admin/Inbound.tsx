// import React, { useState } from 'react';
// import styled, { keyframes } from 'styled-components';

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const pulse = keyframes`
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.05);
//   }
//   100% {
//     transform: scale(1);
//   }
// `;

// const PageContainer = styled.div`
//   min-height: 100vh;
//   padding: 40px 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
// `;

// const Header = styled.div`
//   width: 100%;
//   max-width: 1200px;
//   margin-bottom: 40px;
//   animation: ${fadeIn} 0.6s ease-out forwards;
// `;

// const BackLink = styled.a`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   color: #1a237e;
//   text-decoration: none;
//   font-size: 1.25rem;
//   margin-bottom: 24px;
//   transition: all 0.3s ease;
  
//   &:hover {
//     transform: translateX(-5px);
//     color: #303f9f;
//   }
// `;

// const Title = styled.h1`
//   color: #1a237e;
//   font-size: 2.5rem;
//   margin: 0;
//   font-weight: 600;
//   position: relative;
  
//   &::after {
//     content: '';
//     position: absolute;
//     bottom: -8px;
//     left: 0;
//     width: 60px;
//     height: 4px;
//     background: linear-gradient(90deg, #1a237e, #303f9f);
//     border-radius: 2px;
//   }
// `;

// const CardsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 30px;
//   width: 100%;
//   max-width: 1200px;
//   padding: 20px 0;
// `;

// const DataSourceCard = styled.div`
//   background: rgba(255, 255, 255, 0.95);
//   border-radius: 16px;
//   box-shadow: 
//     0 4px 20px rgba(0, 0, 0, 0.05),
//     0 8px 32px rgba(31, 38, 135, 0.1);
//   overflow: hidden;
//   cursor: pointer;
//   transition: all 0.3s ease-in-out;
//   position: relative;
//   animation: ${fadeIn} 0.6s ease-out forwards;
//   animation-delay: ${props => props.$index * 0.1}s;
//   opacity: 0;

//   &:hover {
//     transform: translateY(-8px);
//     box-shadow: 
//       0 8px 30px rgba(0, 0, 0, 0.1),
//       0 12px 40px rgba(31, 38, 135, 0.15);
//   }
// `;

// const ColorBar = styled.div`
//   height: 4px;
//   background: ${props => props.$color};
//   transition: height 0.3s ease;

//   ${DataSourceCard}:hover & {
//     height: 6px;
//   }
// `;

// const CardContent = styled.div`
//   padding: 25px;
//   display: grid;
//   grid-template-columns: auto 24px;
//   gap: 20px;
//   position: relative;
// `;

// const IconTitle = styled.div`
//   display: flex;
//   gap: 20px;
//   align-items: center;
// `;

// const IconContainer = styled.div`
//   width: 48px;
//   height: 48px;
//   background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: all 0.3s ease;

//   ${DataSourceCard}:hover & {
//     transform: scale(1.1) rotate(5deg);
//   }
// `;

// const Icon = styled.img`
//   width: 28px;
//   height: 28px;
//   transition: all 0.3s ease;
// `;

// const TextContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;

// const DataSourceTitle = styled.h3`
//   margin: 0;
//   color: #1a237e;
//   font-size: 1.25rem;
//   font-weight: 600;
//   transition: color 0.3s ease;

//   ${DataSourceCard}:hover & {
//     color: ${props => props.$color};
//   }
// `;

// const DataSourceDescription = styled.p`
//   margin: 0;
//   color: #64748b;
//   font-size: 0.95rem;
//   line-height: 1.5;
// `;

// const Arrow = styled.span`
//   color: ${props => props.$color};
//   font-size: 1.5rem;
//   align-self: center;
//   transition: transform 0.3s ease;

//   ${DataSourceCard}:hover & {
//     transform: translateX(5px);
//   }
// `;

// const Badge = styled.span`
//   position: absolute;
//   top: 15px;
//   right: 15px;
//   padding: 4px 8px;
//   background: linear-gradient(135deg, ${props => props.$color}20, ${props => props.$color}40);
//   color: ${props => props.$color};
//   border-radius: 12px;
//   font-size: 0.75rem;
//   font-weight: 500;
//   opacity: 0;
//   transform: translateY(-10px);
//   transition: all 0.3s ease;

//   ${DataSourceCard}:hover & {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const dataSources = [
//   {
//     id: 1,
//     title: 'Alfresco',
//     description: 'Enterprise content management and document sharing platform integration.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
//     color: '#4CAF50',
//     status: 'Popular'
//   },
//   {
//     id: 2,
//     title: 'Amazon S3',
//     description: 'Secure cloud storage with unlimited scalability and high availability.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
//     color: '#FF9900',
//     status: 'Enterprise'
//   },
//   {
//     id: 3,
//     title: 'Azure Blob',
//     description: 'Microsoft\'s scalable object storage for unstructured data.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
//     color: '#0089D6',
//     status: 'Cloud'
//   },
//   {
//     id: 4,
//     title: 'Box',
//     description: 'Enterprise-grade content management and file sharing platform.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
//     color: '#0061D5',
//     status: 'Enterprise'
//   },
//   {
//     id: 5,
//     title: 'CSV Import',
//     description: 'Simple and efficient data import from structured CSV files.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
//     color: '#424242',
//     status: 'Basic'
//   },
//   {
//     id: 6,
//     title: 'Confluence',
//     description: 'Team collaboration and knowledge sharing platform integration.',
//     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg',
//     color: '#0052CC',
//     status: 'Team'
//   }
// ];

// const Inbound: React.FC = () => {
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null);

//   return (
//     <PageContainer>
//       <Header>
//         <BackLink href="#">
//           ← Create a new data source
//         </BackLink>
//         <Title>Data Sources</Title>
//       </Header>
//       <CardsGrid>
//         {dataSources.map((source, index) => (
//           <DataSourceCard 
//             key={source.id}
//             $index={index}
//             $isHovered={hoveredCard === source.id}
//             onMouseEnter={() => setHoveredCard(source.id)}
//             onMouseLeave={() => setHoveredCard(null)}
//           >
//             <ColorBar $color={source.color} />
//             <CardContent>
//               <Badge $color={source.color}>{source.status}</Badge>
//               <IconTitle>
//                 <IconContainer>
//                   <Icon src={source.icon} alt={`${source.title} icon`} />
//                 </IconContainer>
//                 <TextContent>
//                   <DataSourceTitle $color={source.color}>{source.title}</DataSourceTitle>
//                   <DataSourceDescription>{source.description}</DataSourceDescription>
//                 </TextContent>
//               </IconTitle>
//               <Arrow $color={source.color}>→</Arrow>
//             </CardContent>
//           </DataSourceCard>
//         ))}
//       </CardsGrid>
//     </PageContainer>
//   );
// };

// export default Inbound;


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Box, Database, Cloud, FileText, FolderGit2, Server } from 'lucide-react';

const dataSources = [
  {
    id: 1,
    title: 'Alfresco',
    description: 'Enterprise content management and document sharing platform integration.',
    icon: Box,
    color: '#4CAF50',
    status: 'Popular'
  },
  {
    id: 2,
    title: 'Amazon S3',
    description: 'Secure cloud storage with unlimited scalability and high availability.',
    icon: Cloud,
    color: '#FF9900',
    status: 'Enterprise'
  },
  {
    id: 3,
    title: 'Azure Blob',
    description: 'Microsoft\'s scalable object storage for unstructured data.',
    icon: Database,
    color: '#0089D6',
    status: 'Cloud'
  },
  {
    id: 4,
    title: 'Box',
    description: 'Enterprise-grade content management and file sharing platform.',
    icon: Server,
    color: '#0061D5',
    status: 'Enterprise'
  },
  {
    id: 5,
    title: 'CSV Import',
    description: 'Simple and efficient data import from structured CSV files.',
    icon: FileText,
    color: '#424242',
    status: 'Basic'
  },
  {
    id: 6,
    title: 'Confluence',
    description: 'Team collaboration and knowledge sharing platform integration.',
    icon: FolderGit2,
    color: '#0052CC',
    status: 'Team'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const Inbound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-colors"
          >
            <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Create a new data source</span>
          </motion.a>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Data Sources
          </motion.h1>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dataSources.map((source, index) => (
            <motion.div
              key={source.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
              className="bg-white/80 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-50 group"
            >
              <div className="h-2 bg-gradient-to-r" style={{ 
                background: `linear-gradient(to right, ${source.color}40, ${source.color}60)` 
              }} />
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                  >
                    <source.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{source.title}</h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r"
                      style={{ 
                        background: `linear-gradient(to right, ${source.color}20, ${source.color}40)`,
                        color: source.color
                      }}
                    >
                      {source.status}
                    </motion.span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {source.description}
                </p>
                
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors"
                >
                  <span className="text-sm font-medium">Learn more</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Inbound;
