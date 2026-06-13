-- Supabase Database Schema for JustBlog
-- Execute this in the Supabase SQL editor

CREATE TABLE Users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'User' CHECK (role IN ('Admin', 'Author', 'User')),
  avatar TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  category VARCHAR(100),
  authorId UUID REFERENCES Users(id) ON DELETE CASCADE,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE BlogTags (
  blogId UUID REFERENCES Blogs(id) ON DELETE CASCADE,
  tagId UUID REFERENCES Tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blogId, tagId)
);

CREATE TABLE Comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blogId UUID REFERENCES Blogs(id) ON DELETE CASCADE,
  userId UUID REFERENCES Users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blogId UUID REFERENCES Blogs(id) ON DELETE CASCADE,
  userId UUID REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE(blogId, userId)
);

CREATE TABLE Bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blogId UUID REFERENCES Blogs(id) ON DELETE CASCADE,
  userId UUID REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE(blogId, userId)
);

CREATE TABLE NewsletterSubscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
