import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {MainLayout} from '../components/MainLayout'
import {MyPost} from "../interfaces/post";
import {NextPageContext} from "next";

interface PostsPageProps {
    posts: MyPost[]
}

export default function Posts({ posts: serverPosts }:PostsPageProps) {
    const [posts, setPosts] = useState(serverPosts)
    useEffect(() => {
        async function load() {
            const response = await fetch('http://localhost:4200/posts')
            const json = await response.json()
            setPosts(json)
        }

        if (!serverPosts) {
            load()
        }
    }, [])

    if (!posts) {
        return (
            <MainLayout>
                <p>Loading...</p>
            </MainLayout>
        )
    }
    return (
    <MainLayout title="Posts">
        <Head>
            <title>Posts page</title>
        </Head>
        <h1>Posts Page</h1>
        <ul>
            {posts.map(post =>
                <li key={post.id}>
                    <Link href={`/post/${post.id}`}>
                    {/*<Link href={`/post/[id]`} as={`/post/${post.id}`}>*/}
                        <a>{post.title}</a>
                    </Link>
                </li>
            )}
        </ul>
    </MainLayout>
    )
}

Posts.getInitialProps = async ({ req }: NextPageContext) => {
    if (!req) {
        return { posts: null }
    }

    const response = await fetch(`${process.env.API_URL}/posts`)
    const posts: MyPost[] = await response.json()

    return {
        posts
    }
}
