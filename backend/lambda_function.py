import json
import boto3
import base64
from datetime import datetime, timezone
import pytz

# Initialize Bedrock client
bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event, context):
    # Handle CORS preflight for Function URL
    if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        # Handle both API Gateway and Function URL formats
        if 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        caption = body.get('caption', '')
        platform = body.get('platform', 'instagram')
        image_data = body.get('image', None)
        
        # Get user preferences

        user_timezone = body.get('timezone', None) # e.g., 'America/New_York'
        target_audience = body.get('target_audience', 'global')  # 'local', 'us', 'europe', 'asia', 'global'

        # Generate optimized content
        optimized_caption = optimize_caption(caption, platform)
        hashtags = generate_hashtags(caption, platform)
        best_time = get_best_posting_time(platform, user_timezone, target_audience)
        engagement_score = predict_engagement(optimized_caption, hashtags, platform)
        
        response = {
            'original_caption': caption,
            'optimized_caption': optimized_caption,
            'hashtags': hashtags,
            'best_time': best_time,
            'engagement_score': engagement_score,
            'platform': platform
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(response)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def optimize_caption(caption, platform):
    platform_prompts = {
       'instagram': f"Transform this text into an Instagram caption: '{caption}'. Rules: Use casual tone, add 2-3 emojis, keep it engaging. Output format: Just the caption text, no explanations, no quotes, no additional text.",
        'linkedin': f"Transform this text into a LinkedIn post: '{caption}'. Rules: Professional tone, business-focused, no emojis. Output format: Just the post text, no explanations, no quotes, no additional text.",
        'twitter': f"Transform this text into a Twitter post: '{caption}'. Rules: Under 280 characters, punchy, engaging. Output format: Just the tweet text, no explanations, no quotes, no additional text.",
        'tiktok': f"Transform this text into a TikTok caption: '{caption}'. Rules: Trendy language, fun tone, include call-to-action. Output format: Just the caption text, no explanations, no quotes, no additional text."
    }
    
    prompt = platform_prompts.get(platform, platform_prompts['instagram'])
    
    try:
        response = bedrock.invoke_model(
            modelId='us.amazon.nova-micro-v1:0',
            body=json.dumps({
                'messages': [{'role': 'user', 'content': [{'text': prompt}]}],
                'inferenceConfig': {
                    'maxTokens': 100,
                    'temperature': 0.3
                }
            })
        )
        
        result = json.loads(response['body'].read())
        print(f"Nova response: {result}")
        
        # Nova response format
        if 'output' in result and 'message' in result['output']:
            response_text = result['output']['message']['content'][0]['text'].strip()
            # Clean up response - remove quotes, explanations, etc.
            response_text = response_text.replace('"', '').replace("'", "")
            if response_text.lower().startswith(('here', 'caption:', 'rewritten')):
                lines = response_text.split('\n')
                for line in lines:
                    if line.strip() and not line.lower().startswith(('here', 'caption:', 'rewritten')):
                        return line.strip()
            return response_text
        else:
            return generate_smart_caption(caption, platform)
    except Exception as e:
        print(f"Nova API error: {e}")
        return generate_smart_caption(caption, platform)

def generate_hashtags(caption, platform):
    prompt = f"Create 5 hashtags for {platform}. Content: '{caption}'. Rules: Start each with #, relevant to content and platform, popular tags. Output format: #tag1 #tag2 #tag3 #tag4 #tag5 (no other text)"
    
    try:
        response = bedrock.invoke_model(
            modelId='us.amazon.nova-micro-v1:0',
            body=json.dumps({
                'messages': [{'role': 'user', 'content': [{'text': prompt}]}],
                'inferenceConfig': {
                    'maxTokens': 50,
                    'temperature': 0.3
                }
            })
        )
        
        result = json.loads(response['body'].read())
        
        if 'output' in result and 'message' in result['output']:
            text = result['output']['message']['content'][0]['text'].strip()
            import re
            # Extract only hashtags, ignore any explanatory text
            hashtags_found = re.findall(r'#\w+', text)
            # Clean hashtags and ensure we have exactly 5
            clean_hashtags = [tag for tag in hashtags_found if len(tag) > 1][:5]
            return clean_hashtags if len(clean_hashtags) >= 3 else generate_smart_hashtags(caption, platform)
        else:
            return generate_smart_hashtags(caption, platform)
    except Exception as e:
        print(f"Nova hashtag error: {e}")
        return generate_smart_hashtags(caption, platform)

def get_best_posting_time(platform, user_timezone=None, target_audience='global'):
    """
    Get optimal posting times considering timezone and target audience
    user_timezone: User's timezone (e.g., 'America/New_York', 'Europe/London')
    target_audience: 'local', 'us', 'europe', 'asia', 'global'
    """
    
    # Global peak times in UTC for maximum reach
    global_peaks = {
        'instagram': {
            'primary': {'utc_hour': 13, 'time_range': '1:00-3:00 PM UTC'},  # US lunch + EU evening
            'secondary': {'utc_hour': 20, 'time_range': '8:00-10:00 PM UTC'},  # US evening + Asia morning
            'reason': 'Captures US lunch break and European evening engagement'
        },
        'linkedin': {
            'primary': {'utc_hour': 14, 'time_range': '2:00-4:00 PM UTC'},  # US morning + EU afternoon
            'secondary': {'utc_hour': 8, 'time_range': '8:00-10:00 AM UTC'},  # EU morning + Asia afternoon
            'reason': 'Professional users active during business hours across timezones'
        },
        'twitter': {
            'primary': {'utc_hour': 16, 'time_range': '4:00-6:00 PM UTC'},  # US noon + EU evening
            'secondary': {'utc_hour': 12, 'time_range': '12:00-2:00 PM UTC'},  # US morning + EU afternoon
            'reason': 'News and discussion peak during overlapping active hours'
        },
        'tiktok': {
            'primary': {'utc_hour': 19, 'time_range': '7:00-9:00 PM UTC'},  # US afternoon + EU night
            'secondary': {'utc_hour': 2, 'time_range': '2:00-4:00 AM UTC'},   # Asia evening peak
            'reason': 'Entertainment content peaks when multiple regions are active'
        }
    }
    
    # Regional specific times
    regional_peaks = {
        'us': {
            'instagram': '6:00-9:00 PM EST',
            'linkedin': '8:00-10:00 AM EST', 
            'twitter': '12:00-3:00 PM EST',
            'tiktok': '6:00-10:00 PM EST'
        },
        'europe': {
            'instagram': '7:00-9:00 PM CET',
            'linkedin': '9:00-11:00 AM CET',
            'twitter': '1:00-3:00 PM CET', 
            'tiktok': '7:00-10:00 PM CET'
        },
        'asia': {
            'instagram': '8:00-10:00 PM JST',
            'linkedin': '9:00-11:00 AM JST',
            'twitter': '12:00-2:00 PM JST',
            'tiktok': '8:00-11:00 PM JST'
        }
    }
    
    platform_data = global_peaks.get(platform, global_peaks['instagram'])
    
    if target_audience == 'global':
        # Convert UTC times to user's timezone if provided
        if user_timezone:
            try:
                import pytz
                user_tz = pytz.timezone(user_timezone)
                utc_time = datetime.now(pytz.UTC).replace(hour=platform_data['primary']['utc_hour'], minute=0)
                local_time = utc_time.astimezone(user_tz)
                
                return {
                    'global_optimal': platform_data['primary']['time_range'],
                    'your_timezone': f"{local_time.strftime('%I:%M %p %Z')}",
                    'secondary_peak': platform_data['secondary']['time_range'],
                    'strategy': 'global_reach',
                    'reason': platform_data['reason'],
                    'tip': f"Post at {local_time.strftime('%I:%M %p')} your time for maximum global engagement"
                }
            except:
                pass
        
        return {
            'global_optimal': platform_data['primary']['time_range'],
            'secondary_peak': platform_data['secondary']['time_range'], 
            'strategy': 'global_reach',
            'reason': platform_data['reason'],
            'tip': 'Use global UTC times for maximum international reach'
        }
    
    elif target_audience in regional_peaks:
        regional_time = regional_peaks[target_audience].get(platform)
        return {
            'regional_optimal': regional_time,
            'strategy': f'{target_audience}_focused',
            'reason': f'Optimized for {target_audience.upper()} audience engagement patterns'
        }
    
    # Fallback to global
    return {
        'time': platform_data['primary']['time_range'],
        'reason': platform_data['reason']
    }

def predict_engagement(caption, hashtags, platform):
    prompt = f"Rate this {platform} post engagement (1-10). Caption: '{caption}'. Hashtags: {' '.join(hashtags)}. Output format: [number] [brief reason] (example: 8 Good use of trending hashtags)"
    
    try:
        response = bedrock.invoke_model(
            modelId='us.amazon.nova-micro-v1:0',
            body=json.dumps({
                'messages': [{'role': 'user', 'content': [{'text': prompt}]}],
                'inferenceConfig': {
                    'maxTokens': 30,
                    'temperature': 0.3
                }
            })
        )
        
        result = json.loads(response['body'].read())
        
        if 'output' in result and 'message' in result['output']:
            text = result['output']['message']['content'][0]['text'].strip()
            import re
            score_match = re.search(r'(\d+)', text)
            score = int(score_match.group(1)) if score_match else 7
            # Extract explanation after the number
            explanation = re.sub(r'^\d+\s*', '', text).strip()[:80]
            return {
                'score': min(max(score, 1), 10),
                'explanation': explanation if explanation else f'Score {score}/10 - Good potential'
            }
        else:
            return generate_smart_score(caption, platform)
    except Exception as e:
        print(f"Nova scoring error: {e}")
        return generate_smart_score(caption, platform)

def generate_smart_caption(caption, platform):
    optimizations = {
        'instagram': {'prefix': ['✨', '🔥', '💫'], 'suffix': ['What do you think? 💭', 'Drop a comment! 👇']},
        'linkedin': {'prefix': ['Key insight:', 'Professional tip:'], 'suffix': ['What\'s your experience?', 'Share your thoughts.']},
        'twitter': {'prefix': ['🧵', '💡'], 'suffix': ['Thoughts? 💭', 'RT if you agree 🔄']},
        'tiktok': {'prefix': ['🔥', '✨'], 'suffix': ['Who\'s with me? 🙋♀️', 'Try this! 💪']}
    }
    
    opt = optimizations.get(platform, optimizations['instagram'])
    import random
    
    if platform == 'linkedin':
        return f"{caption}\n\n{random.choice(opt['prefix'])}\n• Enhanced engagement\n• Better reach\n\n{random.choice(opt['suffix'])}"
    else:
        return f"{random.choice(opt['prefix'])} {caption} {random.choice(opt['suffix'])}"

def generate_smart_hashtags(caption, platform):
    hashtag_sets = {
        'instagram': ['#instagood', '#photooftheday', '#love', '#beautiful', '#happy'],
        'linkedin': ['#professional', '#career', '#business', '#networking', '#growth'],
        'twitter': ['#trending', '#viral', '#thoughts', '#discussion', '#news'],
        'tiktok': ['#fyp', '#viral', '#trending', '#foryou', '#tiktok']
    }
    
    content_keywords = {
        'workout': ['#fitness', '#gym', '#health'],
        'coffee': ['#coffee', '#coding', '#developer'],
        'work': ['#productivity', '#hustle', '#grind']
    }
    
    base_tags = hashtag_sets.get(platform, hashtag_sets['instagram'])
    caption_lower = caption.lower()
    
    relevant_tags = []
    for keyword, tags in content_keywords.items():
        if keyword in caption_lower:
            relevant_tags.extend(tags)
    
    import random
    all_tags = relevant_tags + base_tags
    return list(dict.fromkeys(all_tags))[:5]

def generate_smart_score(caption, platform):
    score = 5
    if '?' in caption: score += 1
    if any(emoji in caption for emoji in ['😊', '🔥', '✨', '💪', '❤️']): score += 1
    if len(caption.split()) > 10: score += 1
    if platform == 'tiktok' and any(word in caption.lower() for word in ['trend', 'viral']): score += 2
    if platform == 'linkedin' and any(word in caption.lower() for word in ['professional', 'career']): score += 1
    score = min(max(score, 1), 10)
    return {'score': score, 'explanation': f'Score {score}/10 - Good engagement potential'}