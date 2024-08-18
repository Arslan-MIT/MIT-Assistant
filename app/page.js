'use client'

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import SendIcon from '@mui/icons-material/Send'
import BotIcon from '@mui/icons-material/SmartToy'
import UserIcon from '@mui/icons-material/Person'

import Image from 'next/image'
import descriptionImage from '../images/dc.jpeg'
import aiImage from '../images/ai.jpeg'
import BGImage from '../images/bg.jpeg'
import { blue, lightBlue } from '@mui/material/colors'
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🤖 Hi there! I'm here to assist you. How can I help?",
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchHuggingFaceData = async (inputText) => {
    const response = await fetch('/api/huggingface', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: inputText }),
    })

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      console.error('Error fetching Hugging Face API')
      throw new Error('Failed to fetch data from Hugging Face API')
    }
  }

  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return
    setIsLoading(true)

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: `💬 ${inputText}` },
      { role: 'assistant', content: '' },
    ])

    try {
      const data = await fetchHuggingFaceData(inputText)
      if (data) {
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: `🤖 ${data.response}` },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm just a bunch of code, so I don't have feelings, but I'm here and ready to help! How about you? How are you doing today?" },
      ])
    } finally {
      setIsLoading(false)
      setInputText('')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      p={2}
      boxSizing="border-box"
      sx={{
        overflowX: 'hidden', // Prevent horizontal scroll
        
      }}
    >
      {/* Description Box Section */}
      <Box
        width={{ xs: '100%', md: '40%' }}
        height="100%"
        p={3}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: 'relative',
          backgroundImage: `url(${BGImage.src})`,
          backgroundSize: 'cover' ,
          backgroundPosition: 'center',
          color: 'white', // Ensure text contrast on dark image
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.9)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 50, 150, 0.5)', // Darker overlay for better text contrast
            zIndex: 1,
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height={540}
          zIndex={2}
          p={2}
          bgcolor="rgba(255, 255, 255, 0.5)" // Light background for text readability
          borderRadius="16px"
          textAlign="center"
          color="black"
          width='500px'
          boxShadow= "0px 4px 20px rgba(0, 0, 0, 0.5)"
        >
          <Image
            src={descriptionImage}
            alt="Assistant"
            width={440}
            height={300}
            style={{
              borderRadius: '16px',
              marginBottom: '16px',
            }}
          />
          <Typography variant="h4" gutterBottom >
            MIT: Your AI Assistant
          </Typography>
          <Typography variant="body1" paragraph>
            Meet Your Personal AI Assistant: MIT! I&apos;m here to assist you with any concerns you might have. I&apos;ll do my best to provide accurate and helpful responses.
          </Typography>
          <Typography variant="body1" paragraph>
            If you encounter any issues or need further assistance, please let me know, and I&apos;ll be glad to help. Enjoy your chat experience!
          </Typography>
        </Box>
      </Box>
    { /* GAP */}
      <Box
        width={{ xs: '100%', md: '.7%' }}
        height="100%"
        p={.1}
        display="flex"
        flexDirection="row"
        
      ></Box>
      {/* Chat Box Section */}
      <Box
        width={{ xs: '100%', md: '60%' }}
        height="100%"
        display="flex"
        flexDirection="column"
        
        p={2}
        sx={{
          backgroundImage: `url(${aiImage.src})`,
          boxShadow:"0px 4px 20px rgba(0, 0, 0, 0.9)",
            backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: '16px',
        }}
      >
        <Stack
          direction={'column'}
          
          width="100%"
          height="700px"
          border="1px solid #006064"
          borderRadius="16px"
          boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
          p={2}
          bgcolor="rgba(255, 255, 255, 0.5)" // Light background for text readability
          spacing={3}
          position="relative"
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  bgcolor={
                    message.role === 'assistant'
                      ? '#006064'
                      : '#00796B'
                  }
                  color="white"
                  borderRadius={16}
                  p={2}
                  boxShadow="0px 4px 8px rgba(0, 0, 0, 0.5)"
                  maxWidth="75%"
                  sx={{
                    animation: 'fadeIn 0.5s ease',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0 },
                      '100%': { opacity: 1 },
                    },
                  }}
                >
                  {message.role === 'assistant' ? <BotIcon /> : <UserIcon />}
                  <Box ml={1}>{message.content}</Box>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack
            direction={'row'}
            spacing={2}
            position="absolute"
            bottom={0}
            width="calc(100% - 32px)"
            p={1}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px' }}
            marginBottom={15}
          >
            <TextField
              label="Type a message..."
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              
              sx={{ borderRadius: '10px', border: '1px solid #006064' }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              endIcon={<SendIcon />}
              sx={{
                bgcolor: '#00796B',
                borderRadius: '15px',
                '&:hover': { bgcolor: '#004D40' },
              }}
            >
              {isLoading ? 'Processing...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
