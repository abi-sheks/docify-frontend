import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({baseUrl : 'http://127.0.0.1:8000/search'}),
    tagTypes : ['Tag', 'User', 'CurrentUser'],
    endpoints : (builder) => ({
        getTags : builder.query<any, void>({
            query : () => '/tags',
            providesTags : ['Tag'],
        }),
        getTag : builder.query<any, string>({
            query : (tagSlug) => `/tags/${tagSlug}`,
        }),
        addNewTag : builder.mutation({
            query : (tag) => ({
                url : '/tags/',
                method : 'POST',
                body : tag,
            }),
            invalidatesTags : ['Tag'],
        })
    })
})

export const { useGetTagsQuery, useGetTagQuery, useAddNewTagMutation } = apiSlice;