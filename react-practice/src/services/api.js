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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'blog-auth-token',
    storage: window.localStorage,
    // 60분 후 세션 만료
    expiryMargin: 60 * 60
  }
});

export const blogApi = {
  // 게시글 관련 API
  async getPosts(page = 0) {
    try {
      const from = page * 5;
      const to = from + 4;
      
      // 게시글 데이터 가져오기
      const { data: posts, error: postsError, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;

      console.log('원본 게시글 데이터:', posts); // 원본 데이터 확인

      // 각 게시글의 작성자 정보 가져오기
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          if (!post.author_id) return post;

          const { data: authorData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', post.author_id)
            .single();

          console.log('작성자 데이터:', authorData); // 작성자 데이터 확인

          return {
            ...post,
            author: authorData?.name
          };
        })
      );

      // 데이터 포맷팅
      const formattedData = postsWithAuthors.map(post => {
        const formatted = {
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : ''),
          image: post.image_url,
          createdAt: new Date(post.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          author: post.author || '익명',
          likes: post.likes || 0,
          dislikes: post.dislikes || 0
        };
        console.log('포맷팅된 게시글:', formatted); // 포맷팅된 데이터 확인
        return formatted;
      });
      
      return {
        content: formattedData,
        totalPages: Math.ceil(count / 5)
      };
    } catch (error) {
      console.error('게시글 로드 에러:', error);
      throw error;
    }
  },

  createPost: (postData) => supabase.from('posts').insert(postData),
  
  // 인증 관련 API
  auth: {
    // 회원가입
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    // 로그인
    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    // 현재 사용자 확인
    async getCurrentUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('getCurrentUser 에러:', error);
        return null;
      }

      // 토큰 만료 체크
      const session = await supabase.auth.getSession();
      if (session?.data?.session?.expires_at) {
        const expiresAt = new Date(session.data.session.expires_at * 1000);
        if (expiresAt < new Date()) {
          await this.signOut();
          return null;
        }
      }

      return user;
    },

    // 로그아웃
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  // 프로필 관련 API
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(profileData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');

      // 기존 이미지 URL 유지
      let avatarUrl = profileData.avatar_url;
      const imageFile = profileData.imageFile;

      // 새 이미지 파일이 있는 경우에만 업로드 시도
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `public/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('profile_images')
            .upload(filePath, imageFile);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('profile_images')
            .getPublicUrl(filePath);

          avatarUrl = data.publicUrl;
        } catch (error) {
          console.error('이미지 업로드 에러:', error);
          // 이미지 업로드 실패 시 기존 URL 유지
        }
      }

      // 프로필 데이터 업데이트
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          bio: profileData.bio,
          github_url: profileData.github_url,
          linkedin_url: profileData.linkedin_url,
          avatar_url: avatarUrl,  // 새 이미지가 없으면 기존 URL 사용
          updated_at: new Date()
        });

      if (error) throw error;

      return {
        ...profileData,
        avatar_url: avatarUrl
      };
    } catch (error) {
      throw error;
    }
  },
  
  // 좋아요/싫어요 관련 API
  async updateReaction(postId, type) {
    const { error } = await supabase.rpc(
      type === 'like' ? 'increment_likes' : 'increment_dislikes',
      { post_id: postId }
    );
    
    if (error) throw error;
  },

  async getPost(id) {
    try {
      // 먼저 게시글 데이터 가져오기
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postError) throw postError;

      // 작성자 정보 가져오기
      let authorName = '익명';
      if (post.author_id) {
        const { data: authorData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', post.author_id)
          .single();
        
        if (authorData) {
          authorName = authorData.name;
        }
      }

      // 데이터 포맷팅
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image_url,
        createdAt: new Date(post.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        author: authorName,
        author_id: post.author_id,
        likes: post.likes || 0,
        dislikes: post.dislikes || 0
      };
    } catch (error) {
      console.error('게시글 상세 조회 에러:', error);
      throw error;
    }
  },

  // 프로필 이미지 업로드
  async uploadProfileImage(file) {
    try {
      console.log('이미지 업로드 시작:', file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('이미지 업로드 에러:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      console.log('업로드된 이미지 URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('이미지 업로드 중 에러 발생:', error);
      throw error;
    }
  },

  // 블로그 이미지 업로드
  async uploadBlogImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog_images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('blog_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // 게시글 생성 (이미지 포함)
  async createPost(postData, imageFile) {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await this.uploadBlogImage(imageFile);
    }

    const { error } = await supabase.from('posts').insert({
      ...postData,
      image_url: imageUrl,
      created_at: new Date()
    });

    if (error) throw error;
  },

  async getPostNavigation(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title')
      .or(`id.lt.${postId},id.gt.${postId}`)
      .order('id', { ascending: true })
      .limit(2);

    if (error) throw error;

    const navigation = {
      prev: data.find(p => p.id < postId) || null,
      next: data.find(p => p.id > postId) || null
    };

    return { data: navigation };
  },

  updatePost: async (postId, postData, imageFile) => {
    try {
      let imageUrl = postData.image_url;
      
      // Upload new image if provided
      if (imageFile) {
        imageUrl = await blogApi.uploadBlogImage(imageFile);
      }

      const { data, error } = await supabase
        .from('posts')
        .update({
          ...postData,
          image_url: imageUrl,
          updated_at: new Date()
        })
        .eq('id', postId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
}; 