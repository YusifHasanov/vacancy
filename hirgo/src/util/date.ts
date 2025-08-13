/**
 * Checks if a post is considered "new" (posted within the last 24 hours)
 */
export function isNewPost(postedAt: Date | string): boolean {
    const postDate = new Date(postedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays < 1;
  }
  
  /**
   * Formats a posted date in a user-friendly way
   */
  export function formatPostedDate(postedAt: Date | string): string {
    // Ensure we have a valid Date object
    const postDate = postedAt instanceof Date ? postedAt : new Date(postedAt);
    
    // Check if the date is valid
    if (isNaN(postDate.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
    
    if (postDay.getTime() === today.getTime()) {
      return 'Today';
    } else if (postDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      try {
        return postDate.toLocaleDateString('az-AZ', {
          month: 'long',
          day: 'numeric'
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Fallback formatting if locale is not supported
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[postDate.getMonth()]} ${postDate.getDate()}`;
      }
    }
  }
  