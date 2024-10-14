"use client";

import { useState, useEffect } from 'react';
import { account, databases, AFFILIATES_COLLECTION_ID } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

export default function AffiliateLink() {
  const [affiliateLink, setAffiliateLink] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const generateAffiliateLink = async () => {
      try {
        const user = await account.get();
        const affiliate = await databases.listDocuments(AFFILIATES_COLLECTION_ID, [
          `user.$id=${user.$id}`,
        ]);

        if (affiliate.documents.length > 0) {
          setAffiliateLink(`${window.location.origin}?ref=${affiliate.documents[0].$id}`);
        } else {
          const newAffiliate = await databases.createDocument(AFFILIATES_COLLECTION_ID, 'unique()', {
            user: user.$id,
            commissionRate: 0.1, // 10% commission rate
          });
          setAffiliateLink(`${window.location.origin}?ref=${newAffiliate.$id}`);
        }
      } catch (error) {
        console.error('Error generating affiliate link:', error);
      }
    };

    generateAffiliateLink();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Copied to clipboard",
      description: "Your affiliate link has been copied to the clipboard.",
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Affiliate Link</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={affiliateLink}
          readOnly
          className="flex-grow p-2 border rounded"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>
  );
}