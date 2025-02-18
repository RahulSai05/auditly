import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
`;

const DataSourceCard = styled.div`
  width: 280px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.05),
    0 8px 32px rgba(31, 38, 135, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${props => props.$index * 0.1}s;
  opacity: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.1),
      0 12px 40px rgba(31, 38, 135, 0.15);

    &::after {
      transform: translateY(-50%) scale(1.2);
      opacity: 1;
    }

    ${props => props.$isHovered && `
      animation: ${pulse} 2s infinite ease-in-out;
    `}
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.6s ease-out;
    z-index: 0;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, #6e8efb, #4776e6) border-box;
    -webkit-mask: 
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: all 0.3s ease;
  }

  ${DataSourceCard}:hover & {
    transform: scale(1.1);
    
    &::after {
      opacity: 1;
    }
  }
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
`;

const DataSourceTitle = styled.h3`
  margin: 15px 0 10px;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #6e8efb, #4776e6);
    transition: width 0.3s ease;
    margin: 5px auto 0;
  }

  ${DataSourceCard}:hover &::after {
    width: 50%;
  }
`;

const DataSourceDescription = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  position: relative;
  z-index: 1;
`;

const Badge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #6e8efb20, #4776e620);
  color: #4776e6;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  ${DataSourceCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Updated data with status and more realistic icon paths
const dataSources = [
  {
    id: 1,
    title: 'Alfresco',
    description: 'Enterprise content management and document sharing platform integration.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    status: 'Popular'
  },
  {
    id: 2,
    title: 'Amazon S3',
    description: 'Secure cloud storage with unlimited scalability and high availability.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
    status: 'Enterprise'
  },
  {
    id: 3,
    title: 'Azure Blob',
    description: 'Microsoft\'s scalable object storage for unstructured data.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    status: 'Cloud'
  },
  {
    id: 4,
    title: 'CSV Import',
    description: 'Simple and efficient data import from structured CSV files.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csv/csv-original.svg',
    status: 'Basic'
  }
];

const Inbound: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <PageContainer>
      {dataSources.map((source, index) => (
        <DataSourceCard 
          key={source.id}
          $index={index}
          $isHovered={hoveredCard === source.id}
          onMouseEnter={() => setHoveredCard(source.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Badge>{source.status}</Badge>
          <IconContainer>
            <Icon src={source.icon} alt={`${source.title} icon`} />
          </IconContainer>
          <DataSourceTitle>{source.title}</DataSourceTitle>
          <DataSourceDescription>{source.description}</DataSourceDescription>
        </DataSourceCard>
      ))}
    </PageContainer>
  );
};

export default Inbound;
