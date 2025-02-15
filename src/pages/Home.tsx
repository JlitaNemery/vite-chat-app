import { Box, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Chat from '../components/Chat';

const Home = () => {
  const { roomName } = useParams();

  return (
    <div id="home">
      <Box maxW="600px" mx="auto" p={4} height="100%">
        {roomName ? (
          <Chat roomName={roomName} />
        ) : (
          <Box>
            <Heading size="md" mb={4}>
              No chat room selected yet...
            </Heading>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Home;
