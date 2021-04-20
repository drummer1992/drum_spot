import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAuth, selectUser } from "../redux/reducers/user"
import { fetchProfile } from "../redux/actions/user"
import { Loader } from "../components/Loader"
import { getToken } from "../storage"
import { Type as t } from "../redux/types"

const TokenProvider = ({ children }) => {
  const [ready, setReady] = useState(false)
  const auth = useSelector(selectAuth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!('token' in auth)) {
      dispatch(async () => {
        const token = await getToken()

        dispatch({ type: [t.FETCH_INITIAL_TOKEN], token })
      })
    }

    if (auth.token || auth.token === null) {
      setReady(true)
    }
  }, [auth])

  return (
    <Loader loading={!ready}>
      {children}
    </Loader>
  )
}

const ProfileProvider = ({ children }) => {
  const { loading, loaded, error } = useSelector(selectUser)
  const { token } = useSelector(selectAuth)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!loading && !loaded && !error && token) {
      dispatch(fetchProfile())
    }
  }, [loading, loaded, token, error])

  return (
    <Loader
      error={error}
      loaded={loaded}
      loading={loading}
    >
      {children}
    </Loader>
  )
}

export const UserProvider = ({ children }) => {
  return (
    <TokenProvider>
      <ProfileProvider>
        {children}
      </ProfileProvider>
    </TokenProvider>
  )
}