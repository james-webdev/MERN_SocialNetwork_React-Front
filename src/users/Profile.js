import React from "react";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../core/Menu";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import avatarImage from "../images/avatar.PNG";
import PostsByUser from "../posts/PostsByUser";
import FollowProfileButton from "../users/FollowProfileButton";
import DeleteUser from "../users/DeleteUser";

const Profile = (props) => {
  const [state, setState] = useState({
    user: { following: [], followers: [] },
    redirect: false,
    following: false,
    followersCount: 0,
    followingCount: 0,
  });

  const checkFollow = (user) => {
    const jwt = isAuthenticated();
    console.log("jwt", jwt);
    const match = user.followers.find((follower) => {
      // console.log('fooloower', follower);
      return follower._id === jwt.user._id;
    });
    return match;
  };

  useEffect(() => {
    const fetchProfile = () => {
      // console.log("user ID from route params", props.match.params.userId);
      const userId = props.match.params.userId;
      // console.log(userId);
      const token = isAuthenticated().token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const bodyParameters = {
        key: "value",
      };
      axios
        .get(`http://178.62.76.166/api/user/${userId}`, bodyParameters, config)
        .then(function (response) {
          if (response.status === 200) {
            // console.log("response data", response.data);
            // console.log("response data", response.data);
            let following = checkFollow(response.data);
            // console.log("following boolean", following);
            setState((prevState) => ({
              ...prevState,
              user: response.data,
              following,
              followersCount: response.data.followers.length,
              followingCount: response.data.following.length,
            }));
            // console.log(response.data);
            // console.log("user in state", state.user);
          } else {
            console.log("Some error ocurred");
            setState((prevState) => ({
              ...prevState,
              redirect: true,
            }));
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fetchProfile();
    // return () => {
    //   setState({});
    // };
  }, [props.match.params.userId]);

  const clickFollowButton = () => {
    // console.log("clicked here");
    const userId = isAuthenticated().user._id;
    // console.log("uId", userId);
    const token = isAuthenticated().token;
    const followId = state.user._id;
    // console.log("fId", followId);
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ userId, followId });
    // console.log("your body", body);

    axios
      .put("http://178.62.76.166/api/user/follow", body, config)
      .then(function (response) {
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            user: response.data,
            following: !state.following,
            followersCount: response.data.followers.length,
            followingCount: response.data.following.length,
          }));
        } else {
          console.log("Some error ocurred");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const clickUnFollowButton = () => {
    // console.log("clicked here");
    const userId = isAuthenticated().user._id;
    // console.log("uId", userId);
    const token = isAuthenticated().token;
    const unFollowId = state.user._id;
    // console.log("fId", followId);
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ userId, unFollowId });
    // console.log("your body", body);

    axios
      .put("http://178.62.76.166/api/user/unfollow", body, config)
      .then(function (response) {
        if (response.status === 200) {
          setState((prevState) => ({
            ...prevState,
            user: response.data,
            following: !state.following,
            followersCount: response.data.followers.length,
            followingCount: response.data.following.length,
          }));
        } else {
          console.log("Some error ocurred");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const userId = props.match.params.userId;
  // const stateUser = state.user;
  // console.log("stateUser :", stateUser);
  return (
    <>
      {state.redirect && <Redirect to="/signin" />}
      <div className="flex justify-center items-center bg-green-200">
        <div className="bg-green-200">
          {/* <p className="text-3xl font-bold">Profile</p> */}
          <div className="text-3xl font-medium p-2">
            <div className="flex p-2 items-center justify-center">
              <p> {state.user.name}</p>
            </div>
            <Link
              to="/userupdateform"
              className="flex items-center justify-center w-36 rounded p-2 mt-2"
            >
              <img
                title="Click to update profile pic"
                className="rounded border-4 border-white"
                src={`http://178.62.76.166/api/user/photo/${state.user._id}`}
                onError={(i) => (i.target.src = `${avatarImage}`)}
                alt={state.user.name}
                style={{ objectFit: "cover", height: "96px", width: "96px" }}
              ></img>
            </Link>
            {/* <p>Joined: {new Date(state.user.created).toDateString()}</p> */}
          </div>
        </div>

        {isAuthenticated().user &&
        isAuthenticated().user._id === state.user._id ? (
          <>
            <div className="pt-14 bg-green-200">
              {/* <button class="bg-green-600 shadow hover:bg-green-800 text-black font-bold py-2 px-4 rounded ml-4 mt-3 mr-15">
                  Delete Profile
                </button>

                <button class="bg-white shadow text-black font-bold py-1 px-2 rounded ml-4 mt-3 mr-15">
                  Upload Profile Pic
                </button>*/}

              <Link
                to={`/postcreate/${isAuthenticated().user._id}`}
                className="bg-white text-sm shadow hover:bg-gray-100 text-black font-bold py-2 px-4 rounded mt-3 mr-15"
              >
                Create Post
              </Link>
              <DeleteUser userId={isAuthenticated().user._id} />
            </div>
          </>
        ) : (
          // <p>{state.following ? "following" : "not following"}</p>
          <FollowProfileButton
            onFollowButtonClick={clickFollowButton}
            onUnFollowButtonClick={clickUnFollowButton}
            following={state.following}
          />
        )}
        <div>
          {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
            <div class="mt-5 rounded-sm mr-3 ml-1 mt-4 sm:ml-4 p-1 sm:p-3 bg-gray-300 border border-solid border-black">
              <div className="">
                <p className="mb-2 text-3xl text-red-500 font-medium p-2">
                  Delete Profile as an Admin
                </p>
                <p className="mb-2 text-xs text-red-500 p-2">
                  You'll need to sign back in after
                </p>
                <div className="flex justify-center items-center">
                  <DeleteUser userId={state.user._id} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center bg-green-200 text-2xl font-medium">
        <div className="p-3">
          Followers{" "}
          <p className="text-green-600 inline">{state.followersCount}</p>{" "}
          {/* <div className="text-green-600">{state.followersCount}</div> to={`/followers/${state.user._id}`} */}
        </div>
        <div className="p-3">
          Following{" "}
          <p className="text-green-600 inline">{state.followingCount}</p>{" "}
          {/* <div className="text-green-600">{state.followingCount}</div> */}
        </div>
      </div>
      <PostsByUser userId={userId} following={state.followers} />
    </>
  );
};

export default Profile;
