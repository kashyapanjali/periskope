# Periskope Chat Application

This is a chat application built with Next.js, Tailwind CSS, and Supabase for the Periskope recruitment process.

## Preview Mode

The current version is running in preview mode with mock data. No Supabase connection is required to view the UI.

## Setting Up for Production

To set up this application with a real Supabase backend:

1. Create a Supabase project at https://supabase.com
2. Set up the database tables as specified in the assignment
3. Add the following environment variables to your project:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`
4. Replace the mock implementation in `components/supabase-provider.tsx` with the real Supabase client initialization

## Features

- Chat interface with sidebar and message area
- Real-time messaging (when connected to Supabase)
- Search functionality
- Message grouping by date
- Responsive design

## Development

To run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the result.
