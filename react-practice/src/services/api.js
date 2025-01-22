import { createClient } from '@supabase/supabase-js'

console.log('환경변수 확인:', {
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
  SUPABASE_KEY: process.env.REACT_APP_SUPABASE_KEY
});

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase 환경변수가 설정되지 않았습니다.');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export const blogApi = {
  // 게시글 관련 API
  async getPosts(page) {
    const from = page * 5
    const to = from + 4
    
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return {
      data: {
        content: data,
        totalPages: Math.ceil(count / 5)
      }
    }
  },

  createPost: (postData) => supabase.from('posts').insert(postData),
  
  // 프로필 관련 API
  getProfile: () => supabase.from('profiles').select('*'),

  async updateProfile(profile) {
    const { error } = await supabase
      .from('profiles')
      .upsert(profile)
    
    if (error) throw error
  },
  
  // 좋아요/싫어요 관련 API
  async updateReaction(postId, type) {
    const { error } = await supabase.rpc(
      type === 'LIKE' ? 'increment_likes' : 'increment_dislikes',
      { post_id: postId }
    )
    
    if (error) throw error
  },

  async getPost(id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}; 