import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tag, Doc } from '../../interfaces'


const authHeader = (token: string) => {
    return {
        Authorization: `Token ${token}`
    }
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api' }),
    tagTypes: ['Tag', 'User', 'CurrentUser', 'Doc', 'DocSearch', 'Comment'],
    endpoints: (builder) => ({
        getTags: builder.query<any, any>({
            query: (token: string) => ({
                url: '/tags',
                headers: authHeader(token)
            }),
            providesTags: (result = [], error, arg) => [
                'Tag',
                'Doc',
                ...result.map(({ id }: any) => [{ type: 'Tag', id }])
            ]
        }),
        getTag: builder.query<any, any>({
            query: ({ tagId, token }: any) => ({
                url: `/tags/${tagId}`,
                headers: authHeader(token),
            }),
            providesTags: (result, error, arg) => [{ type: 'Tag', id: arg }]
        }),
        addNewTag: builder.mutation({
            query: ({ tag, token }: any) => ({
                url: '/tags/',
                method: 'POST',
                body: tag,
                headers: authHeader(token)
            }),
            invalidatesTags: ['Tag'],
        }),
        editTag: builder.mutation({
            query: ({ tag, token }: any) => ({
                url: `/tags/${tag.id}`,
                method: 'PUT',
                body: tag,
                headers: authHeader(token)
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Tag', id: arg.id }]
        }),
        deleteTag: builder.mutation({
            query: ({ tagId, token }: any) => ({
                url: `/tags/${tagId}`,
                method: "DELETE",
                headers: authHeader(token)
            }),
            invalidatesTags: ['Tag', 'Doc']
        }),
        getDocs: builder.query<any, string>({
            query: (token: string) =>
            ({
                url: '/docs',
                headers: authHeader(token)
            }),
            providesTags: (result = [], error, arg) => [
                'Doc',
                'Tag',
                ...result.map(({ id }: any) => [{ type: "Doc", id }])
            ]
        }),
        getDoc: builder.query<any, any>({
            query: ({ docId, token }: any) =>
            ({
                url: `/docs/${docId}`,
                headers: authHeader(token)
            }),
            providesTags: (result, error, arg) => [{ type: 'Doc', id: arg }],
        }),
        addNewDoc: builder.mutation({
            query: ({ doc, token }) => ({
                url: '/docs/',
                method: "POST",
                body: doc,
                headers: authHeader(token)
            }),
            invalidatesTags: ['Tag', 'Doc', 'DocSearch']
        }),
        editDoc: builder.mutation({
            query: ({ doc, token }) => ({
                url: `/docs/${doc.id}`,
                method: 'PUT',
                body: doc,
                headers: authHeader(token)
            }),
            invalidatesTags: (result, error, arg) => ['Doc', 'Tag', 'DocSearch', { type: 'Doc', id: arg.id }]
        }),
        deleteDoc: builder.mutation({
            query: ({ docId, token }) => ({
                url: `/docs/${docId}`,
                method: 'DELETE',
                headers: authHeader(token)
            }),
            invalidatesTags: ['Doc']
        }),
        getDocSearches: builder.query({
            query: ({ title__contains, token }: any) => ({
                url: `/docs/search`,
                params: { title__contains },
                headers: authHeader(token)
            }),
            providesTags: ['DocSearch'],
        }),

        getUsers: builder.query<any, string>({
            query: (token: string) =>
            ({
                url: '/users',
                headers: authHeader(token),
            }),
            providesTags: ['User']
        }),
        getUser: builder.query<any, any>({
            query: ({userSlug, token} : any) =>
            ({
                url: `/users/${userSlug}`,
                headers : authHeader(token)
            })
        }),
        addNewUser: builder.mutation({
            query: (user) => ({
                url: '/auth/register/',
                method: "POST",
                body: user,
                headers: {
                    mode: 'no-cors',
                }
            }),
            invalidatesTags: ['User', 'Tag']
        }),
        getComments : builder.query<any, string>({
            query : (token : string) => 
            ({
                url : `/comments`,
                headers : authHeader(token),
            }),
            providesTags : ['Comment']
        }),
        addNewComment : builder.mutation({
            query : ({comment, token} : any) => ({
                url : '/comments/',
                method : 'POST',
                body : comment,
                headers : authHeader(token),
            }),
            invalidatesTags : ['Comment']
        })
    })
})

export const {
    useGetTagsQuery,
    useGetTagQuery,
    useAddNewTagMutation,
    useEditTagMutation,
    useDeleteTagMutation,

    useGetDocQuery,
    useGetDocsQuery,
    useAddNewDocMutation,
    useEditDocMutation,
    useDeleteDocMutation,

    useGetUserQuery,
    useGetUsersQuery,
    useAddNewUserMutation,

    useGetDocSearchesQuery,
    
    useGetCommentsQuery,
    useAddNewCommentMutation,
} = apiSlice;