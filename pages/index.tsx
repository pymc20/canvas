import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="container">
            <Head>
                <title>Canvas</title>
            </Head>
            <div className="link-container">
                <h1>Link List</h1>
                <table>
                    <tr>
                        <td>
                            <Link href="/fps">
                                <a>FPS</a>
                            </Link>
                        </td>
                        <td>
                            <Link href="/container">
                                <a>Container</a>
                            </Link>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
