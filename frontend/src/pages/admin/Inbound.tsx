import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px 40px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a237e;
  text-decoration: none;
  font-size: 1.25rem;
  margin-bottom: 16px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 2rem;
  margin: 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
`;

const DataSourceCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ColorBar = styled.div`
  height: 4px;
  background: ${props => props.$color};
`;

const CardContent = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: auto 24px;
  gap: 16px;
`;

const IconTitle = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DataSourceTitle = styled.h3`
  margin: 0;
  color: #1a237e;
  font-size: 1.1rem;
  font-weight: 500;
`;

const DataSourceDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const Arrow = styled.span`
  color: ${props => props.$color};
  font-size: 1.5rem;
  align-self: center;
`;

const dataSources = [
  {
    id: 1,
    title: 'Alfresco',
    description: 'Crawl data from Alfresco.',
    icon: '/alfresco-icon.svg',
    color: '#4CAF50'
  },
  {
    id: 2,
    title: 'Amazon S3',
    description: 'Crawl data from your Amazon S3.',
    icon: '/s3-icon.svg',
    color: '#4CAF50'
  },
  {
    id: 3,
    title: 'Azure Blob',
    description: 'Crawl data from Azure Blob Storage.',
    icon: '/azure-blob-icon.svg',
    color: '#03A9F4'
  },
  {
    id: 4,
    title: 'Azure Files',
    description: 'Crawl data from Azure Files storage.',
    icon: '/azure-files-icon.svg',
    color: '#009688'
  },
  {
    id: 5,
    title: 'Box',
    description: 'Crawl data from Box.',
    icon: '/box-icon.svg',
    color: '#2196F3'
  },
  {
    id: 6,
    title: 'CSV',
    description: 'Crawl data from links in CSV File.',
    icon: '/csv-icon.svg',
    color: '#424242'
  },
  {
    id: 7,
    title: 'Confluence',
    description: 'Crawl data from Confluence.',
    icon: '/confluence-icon.svg',
    color: '#2196F3'
  },
  {
    id: 8,
    title: 'Drupal',
    description: 'Crawl data from Drupal site.',
    icon: '/drupal-icon.svg',
    color: '#2196F3'
  }
];

const Inbound: React.FC = () => {
  return (
    <PageContainer>
      <Header>
        <BackLink href="#">
          ← Create a new data source
        </BackLink>
        <Title>Data Sources</Title>
      </Header>
      <CardsGrid>
        {dataSources.map(source => (
          <DataSourceCard key={source.id}>
            <ColorBar $color={source.color} />
            <CardContent>
              <IconTitle>
                <Icon src={source.icon} alt={`${source.title} icon`} />
                <TextContent>
                  <DataSourceTitle>{source.title}</DataSourceTitle>
                  <DataSourceDescription>{source.description}</DataSourceDescription>
                </TextContent>
              </IconTitle>
              <Arrow $color={source.color}>→</Arrow>
            </CardContent>
          </DataSourceCard>
        ))}
      </CardsGrid>
    </PageContainer>
  );
};

export default Inbound;
