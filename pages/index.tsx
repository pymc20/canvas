import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
let pagesState = []

function Home({ pages }) {
    pagesState = pages.length > 0 ? pages : pagesState
    console.log('pages : ', pagesState)
    return (
        <div className="container">
            <Head>
                <title>Canvas</title>
            </Head>
            <div className="link-container">
                <h1>Link List</h1>
                <div className="link-list">
                    {pagesState.map((page, idx) => {
                        return (
                            <div className="list-item" key={idx}>
                                <Link href={`/${page}`}>
                                    <a>{page}</a>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default withRouter(Home)
