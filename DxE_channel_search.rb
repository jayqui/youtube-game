require 'net/http'
require 'nokogiri'
require 'open-uri'

class YouTubeSearch
	def get_query
		puts ">>>> Enter text to search for on YouTube: "
		search_query = gets.chomp
		search_query.split(" ").join("+")
	end

	def ask_how_many
		puts ">>>> How many videos would you like (up to 20)?"
		gets.chomp.to_i
	end

	def search_dxe_channel(how_many)
		uri = "https://www.youtube.com/channel/UC_mn5Mn952NC1WfwnOLWjew/videos?view=0&sort=p&flow=grid"
		doc = Nokogiri::HTML(open(uri))
		div_objects = doc.css(".yt-lockup-content").take(how_many)

		results = div_objects.map do |div|
			link_objects = div.children.children.select do |child|
			 	child.name == "a"
			end
			view_count = div.css(".yt-lockup-meta-info").children.first.text.gsub(/\D/,"").to_i
			link_objects.map do |link|
				{
					title: link.text,
					url: "https://www.youtube.com" + link.attributes["href"].value,
					views: view_count
				}
			end
		end.flatten
		results
	end

end

yt = YouTubeSearch.new
result = yt.search_dxe_channel(100)
p result
p result.count