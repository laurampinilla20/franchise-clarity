import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";

export function PreferencesSection() {
  const { likedItems, dislikedItems, removeLike, removeDislike } = usePreferences();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Your Preferences</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Likes Column */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Likes</h3>
              <Badge variant="soft" className="ml-auto">
                {likedItems.length}
              </Badge>
            </div>
            {likedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No liked franchises yet
              </p>
            ) : (
              <div className="space-y-3">
                {likedItems.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                  >
                    <Link
                      to={`/best-franchises/brand/${franchise.id}`}
                      className="flex-1 flex items-center gap-3 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {franchise.logo ? (
                          <img
                            src={franchise.logo}
                            alt={franchise.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">
                            {franchise.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {franchise.name}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => removeLike(franchise.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dislikes Column */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsDown className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold text-foreground">Dislikes</h3>
              <Badge variant="soft" className="ml-auto">
                {dislikedItems.length}
              </Badge>
            </div>
            {dislikedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No disliked franchises yet
              </p>
            ) : (
              <div className="space-y-3">
                {dislikedItems.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                  >
                    <Link
                      to={`/best-franchises/brand/${franchise.id}`}
                      className="flex-1 flex items-center gap-3 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {franchise.logo ? (
                          <img
                            src={franchise.logo}
                            alt={franchise.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">
                            {franchise.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {franchise.name}
                      </span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => removeDislike(franchise.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

