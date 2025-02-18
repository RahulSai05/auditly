import React from 'react';
import styled from 'styled-components';

// Define styled components for layout and styling
const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: #f1f5f8; // A light grey background
`;

const DataSourceCard = styled.div`
  width: 250px;
  margin: 10px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DataSourceTitle = styled.h3`
  margin-top: 20px;
  color: #333;
`;

const DataSourceDescription = styled.p`
  text-align: center;
  color: #666;
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
`;

// Example data for displaying cards
const dataSources = [
  { id: 1, title: 'Alfresco', description: 'Crawl data from Alfresco.', icon: '/path-to-alfresco-icon.png' },
  { id: 2, title: 'Amazon S3', description: 'Crawl data from your Amazon S3.', icon: '/path-to-s3-icon.png' },
  { id: 3, title: 'Azure Blob', description: 'Crawl data from Azure Blob Storage.', icon: '/path-to-azure-icon.png' },
  { id: 4, title: 'CSV', description: 'Crawl data from links in CSV File.', icon: '/path-to-csv-icon.png' }
];

const Inbound: React.FC = () => {
  return (
    <PageContainer>
      {dataSources.map(source => (
        <DataSourceCard key={source.id}>
          <Icon src={source.icon} alt={`${source.title} icon`} />
          <DataSourceTitle>{source.title}</DataSourceTitle>
          <DataSourceDescription>{source.description}</DataSourceDescription>
        </DataSourceCard>
      ))}
    </PageContainer>
  );
};

export default Inbound;
