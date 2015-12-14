# require 'net/http'
# require 'nokogiri'
# require 'open-uri'
# require 'json'

# class YouTubeSearch

# 	def search_query(query, how_many)
# 		uri = URI.parse("https://www.youtube.com/results?search_query=#{query}")

# 		# doc is a Ruby object representing a whole html document
# 		doc = Nokogiri::HTML(open(uri))

# 		# find the first `how_many` divs wth the class '.yt-lockup-content'
# 		div_objects = doc.css(".yt-lockup-content").take(how_many)

# 		# map each div object to a hash for its title, url, and number of views
# 		results = div_objects.map do |div|

# 			# select link (a) tag inside title yt-lockup-title div
# 			link_objects = div.css(".yt-lockup-title").children.select do |child|
# 			 	child.name == "a"
# 			end

# 			view_count = div.css(".yt-lockup-meta-info").children.last.text.gsub(/\D/,"").to_i

# 			link_objects.map do |link|
# 				{
# 					title: link.text,
# 					url: "https://www.youtube.com" + link.attributes["href"].value,
# 					views: view_count
# 				}
# 			end
# 		end.flatten

# 		#convert the array of hashes to JSON
# 		results.to_json
# 	end

# end